'use client';

import { useEffect, useState } from 'react';
import { CheckCircle2, AlertCircle, Globe, MapPin, Building2, Map } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import type { Country, State, City } from '@/app/lib/geo-api';

interface HierarchicalAddressProps {
  onAddressChange?: (address: {
    country: string;
    state: string;
    city: string;
    district?: string;
    postalCode?: string;
  }) => void;
  defaultCountry?: string;
}

interface AddressLevel {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  required: boolean;
}

const ADDRESS_LEVELS: Record<string, AddressLevel> = {
  country: {
    icon: Globe,
    title: 'Country',
    description: 'Where are you located?',
    required: true,
  },
  state: {
    icon: MapPin,
    title: 'State / Province',
    description: 'Select your state or province',
    required: false,
  },
  city: {
    icon: Building2,
    title: 'City / Regency',
    description: 'Select your city or municipality',
    required: true,
  },
  district: {
    icon: Map,
    title: 'District / Subdistrict',
    description: 'Select district (optional)',
    required: false,
  },
};

/**
 * Global Hierarchical Address — Premium Redesigned
 * Spec: Phase 4.11.2
 * Modern card-based layout with progress tracking
 */
export function HierarchicalAddressSelect({
  onAddressChange,
  defaultCountry,
}: HierarchicalAddressProps) {
  const [countries, setCountries] = useState<Country[]>([]);
  const [states, setStates] = useState<State[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [districts, setDistricts] = useState<string[]>([]);

  const [selectedCountry, setSelectedCountry] = useState<string>(defaultCountry || '');
  const [selectedState, setSelectedState] = useState<string>('');
  const [selectedCity, setSelectedCity] = useState<string>('');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('');
  const [postalCode, setPostalCode] = useState<string>('');

  const [loadingCountries, setLoadingCountries] = useState(false);
  const [loadingStates, setLoadingStates] = useState(false);
  const [loadingCities, setLoadingCities] = useState(false);
  const [loadingDistricts, setLoadingDistricts] = useState(false);

  const [error, setError] = useState<string>('');

  // Fetch countries on mount
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        setLoadingCountries(true);
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000); // 5s timeout

        const res = await fetch('/api/geo/countries', { signal: controller.signal });
        clearTimeout(timeoutId);

        if (!res.ok) throw new Error('Failed to fetch countries');
        const data = await res.json();
        setCountries(data);
        setError('');
      } catch (err) {
        if (err instanceof Error && err.name === 'AbortError') {
          setError('Request timeout. Please try again.');
        } else {
          console.error('Error fetching countries:', err);
          setError('Unable to load countries');
        }
        setCountries([]);
      } finally {
        setLoadingCountries(false);
      }
    };

    fetchCountries();
  }, []);

  // Fetch states when country changes
  useEffect(() => {
    if (!selectedCountry) {
      setStates([]);
      setSelectedState('');
      setCities([]);
      setSelectedCity('');
      setDistricts([]);
      setSelectedDistrict('');
      return;
    }

    const fetchStates = async () => {
      try {
        setLoadingStates(true);
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);

        const res = await fetch(`/api/geo/states?country=${selectedCountry}`, { signal: controller.signal });
        clearTimeout(timeoutId);

        if (!res.ok) throw new Error('Failed to fetch states');
        const data = await res.json();
        setStates(data);
        setSelectedState('');
        setCities([]);
        setSelectedCity('');
        setDistricts([]);
        setSelectedDistrict('');
        setError('');
      } catch (err) {
        console.error('Error fetching states:', err);
        setStates([]);
        if (err instanceof Error && err.name === 'AbortError') {
          setError('States load timeout');
        } else {
          setError('Unable to load states');
        }
      } finally {
        setLoadingStates(false);
      }
    };

    fetchStates();
  }, [selectedCountry]);

  // Fetch cities when state changes (or when country has no states)
  useEffect(() => {
    if (!selectedCountry) {
      setCities([]);
      setSelectedCity('');
      return;
    }

    // Wait for states to finish loading before fetching cities
    if (loadingStates) {
      setCities([]);
      return;
    }

    if (states.length > 0 && !selectedState) {
      setCities([]);
      setSelectedCity('');
      return;
    }

    const fetchCities = async () => {
      try {
        setLoadingCities(true);
        const stateParam = selectedState || '';
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);

        const res = await fetch(
          `/api/geo/cities?country=${selectedCountry}&state=${stateParam}`,
          { signal: controller.signal }
        );
        clearTimeout(timeoutId);

        if (!res.ok) throw new Error('Failed to fetch cities');
        const data = await res.json();
        setCities(data);
        setSelectedCity('');
        setDistricts([]);
        setSelectedDistrict('');
        setError('');
      } catch (err) {
        console.error('Error fetching cities:', err);
        setCities([]);
        if (err instanceof Error && err.name === 'AbortError') {
          setError('Cities load timeout');
        } else {
          setError('Unable to load cities');
        }
      } finally {
        setLoadingCities(false);
      }
    };

    fetchCities();
  }, [selectedCountry, selectedState, states.length, loadingStates]);

  // Fetch districts when city changes
  useEffect(() => {
    if (!selectedCountry || !selectedCity) {
      setDistricts([]);
      setSelectedDistrict('');
      return;
    }

    const fetchDistricts = async () => {
      try {
        setLoadingDistricts(true);
        const stateParam = selectedState || '';
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);

        const res = await fetch(
          `/api/geo/districts?country=${selectedCountry}&state=${stateParam}&city=${encodeURIComponent(
            selectedCity
          )}`,
          { signal: controller.signal }
        );
        clearTimeout(timeoutId);

        if (!res.ok) throw new Error('Failed to fetch districts');
        const data = await res.json();
        setDistricts(data);
        setSelectedDistrict('');
        setError('');
      } catch (err) {
        console.error('Error fetching districts:', err);
        setDistricts([]);
      } finally {
        setLoadingDistricts(false);
      }
    };

    fetchDistricts();
  }, [selectedCountry, selectedState, selectedCity]);

  // Notify parent on address change
  useEffect(() => {
    if (onAddressChange && selectedCountry && selectedCity) {
      onAddressChange({
        country: selectedCountry,
        state: selectedState,
        city: selectedCity,
        district: selectedDistrict,
        postalCode,
      });
    }
  }, [selectedCountry, selectedState, selectedCity, selectedDistrict, postalCode, onAddressChange]);

  const isCountrySelected = !!selectedCountry;
  const isStateRequired = states.length > 0;
  const isStateSelected = !isStateRequired || !!selectedState;
  const isCitySelected = !!selectedCity;

  // Calculate progress
  let completedSteps = 0;
  if (isCountrySelected) completedSteps++;
  if (isStateSelected && isStateRequired) completedSteps++;
  if (isCitySelected) completedSteps++;
  const totalSteps = (isStateRequired ? 3 : 2);
  const progress = Math.round((completedSteps / totalSteps) * 100);

  const renderLevelCard = (
    level: 'country' | 'state' | 'city' | 'district',
    isVisible: boolean,
    isLoading: boolean,
    options: Array<any>,
    selectedValue: string,
    onSelectChange: (value: string) => void,
    isRequired: boolean = false,
    showCheckmark: boolean = false
  ) => {
    if (!isVisible) return null;

    const levelConfig = ADDRESS_LEVELS[level];
    const IconComponent = levelConfig.icon;

    return (
      <div
        key={level}
        className="rounded-lg border border-border bg-card dark:bg-card p-5 transition-all duration-300 hover:shadow-md hover:border-accent/50 dark:hover:border-accent/60 animate-in fade-in slide-in-from-bottom-2"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10 dark:bg-accent/20 text-accent">
            <IconComponent className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-foreground">
              {levelConfig.title}
              {isRequired && <span className="text-red-500 ml-1">*</span>}
            </h3>
            <p className="text-xs text-muted-foreground">{levelConfig.description}</p>
          </div>
          {showCheckmark && (
            <CheckCircle2 className="h-5 w-5 text-accent shrink-0" />
          )}
        </div>

        <Select value={selectedValue} onValueChange={onSelectChange} disabled={isLoading}>
          <SelectTrigger className="bg-surface/40 dark:bg-surface/60 border-border focus:ring-accent">
            <SelectValue
              placeholder={
                isLoading ? `Loading ${levelConfig.title.toLowerCase()}...` : `Select ${levelConfig.title.toLowerCase()}`
              }
            />
          </SelectTrigger>
          <SelectContent>
            {options.length > 0 ? (
              options.map((opt) => {
                // For cities & districts: use name/value directly
                // For countries & states: use code
                const itemValue = (level === 'city' || level === 'district')
                  ? (typeof opt === 'string' ? opt : opt.name)
                  : (opt.code || opt.name || opt);
                const itemLabel = (typeof opt === 'string' ? opt : opt.name || opt);

                return (
                  <SelectItem
                    key={itemValue}
                    value={itemValue}
                  >
                    {itemLabel}
                  </SelectItem>
                );
              })
            ) : (
              <SelectItem value="no-data" disabled>
                No {levelConfig.title.toLowerCase()} available
              </SelectItem>
            )}
          </SelectContent>
        </Select>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Error Alert */}
      {error && (
        <div className="flex items-start gap-3 rounded-lg bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900 p-4 animate-in fade-in">
          <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
          <span className="text-sm text-red-700 dark:text-red-300">{error}</span>
        </div>
      )}

      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            Location Details
          </span>
          <span className="text-xs font-semibold text-accent">
            {progress}% Complete
          </span>
        </div>
        <div className="w-full h-2 bg-surface/60 dark:bg-surface rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-accent to-accent/80 transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Address Cards */}
      <div className="space-y-4">
        {renderLevelCard(
          'country',
          true,
          loadingCountries,
          countries,
          selectedCountry,
          setSelectedCountry,
          true,
          isCountrySelected
        )}

        {renderLevelCard(
          'state',
          isCountrySelected && isStateRequired,
          loadingStates,
          states,
          selectedState,
          setSelectedState,
          true,
          selectedState !== ''
        )}

        {renderLevelCard(
          'city',
          isCountrySelected,
          loadingCities,
          cities,
          selectedCity,
          setSelectedCity,
          true,
          isCitySelected
        )}

        {renderLevelCard(
          'district',
          isCitySelected && districts.length > 0,
          loadingDistricts,
          districts,
          selectedDistrict,
          setSelectedDistrict,
          false,
          selectedDistrict !== ''
        )}

        {/* Postal Code */}
        {isCitySelected && (
          <div
            key="postal"
            className="rounded-lg border border-border bg-card dark:bg-card p-5 transition-all duration-300 animate-in fade-in slide-in-from-bottom-2"
          >
            <label htmlFor="postal" className="block font-semibold text-foreground mb-3 text-sm">
              Postal Code
              <span className="text-xs text-muted-foreground font-normal ml-2">(Optional)</span>
            </label>
            <input
              id="postal"
              type="text"
              placeholder="e.g., 12345 or 12345-6789"
              value={postalCode}
              onChange={(e) => setPostalCode(e.target.value)}
              className="w-full px-4 py-2.5 border border-border rounded-lg bg-surface/40 dark:bg-surface/60 text-foreground placeholder-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-accent dark:focus:ring-accent focus:border-transparent transition-all"
            />
          </div>
        )}
      </div>

      {/* Summary Card */}
      {isCountrySelected && isCitySelected && (
        <div className="rounded-lg bg-accent/5 dark:bg-accent/10 border border-accent/20 dark:border-accent/30 p-5 space-y-3 animate-in fade-in slide-in-from-bottom-4">
          <div className="flex items-center gap-2 text-accent">
            <CheckCircle2 className="h-5 w-5 shrink-0" />
            <span className="font-semibold">Address Confirmed</span>
          </div>
          <div className="text-sm text-foreground/90 space-y-1">
            <p className="flex items-center gap-2">
              <Globe className="h-4 w-4 text-accent" />
              <span className="font-medium">
                {countries.find((c) => c.code === selectedCountry)?.name}
              </span>
            </p>
            {selectedState && (
              <p className="flex items-center gap-2 ml-1">
                <MapPin className="h-4 w-4 text-accent" />
                <span>{states.find((s) => s.code === selectedState)?.name}</span>
              </p>
            )}
            <p className="flex items-center gap-2 ml-1">
              <Building2 className="h-4 w-4 text-accent" />
              <span>{selectedCity}</span>
            </p>
            {selectedDistrict && (
              <p className="flex items-center gap-2 ml-1">
                <Map className="h-4 w-4 text-accent" />
                <span>{selectedDistrict}</span>
              </p>
            )}
            {postalCode && (
              <p className="text-xs mt-2 pt-2 border-t border-accent/20">
                📍 <span className="font-mono">{postalCode}</span>
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
