import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface FilterState {
  location: string;
  beds: string;
  baths: string;
  propertyType: string;
  amenities: string[];
  availableFrom: string;
  priceRange: [number, number] | [null, null];
  squareFeet: [number, number] | [null, null];
  coordinates: [number, number];
}
interface InitialStateTypes {
  filters: FilterState;
  isFilterFullOpen: boolean;
  viewMode: 'grid' | 'list';
}
export const initialState: InitialStateTypes = {
  filters: {
    location: 'Kharkiv',
    beds: '1',
    baths: '1',
    propertyType: 'any',
    amenities: ['string'],
    availableFrom: 'string',
    priceRange: [null, null],
    squareFeet: [null, null],
    coordinates: [50.0, 36.3],
  },
  isFilterFullOpen: false,
  viewMode: 'grid',
};

export const globalSlice = createSlice({
  initialState,
  name: 'global',
  reducers: {
    setFilters: (state, action: PayloadAction<Partial<FilterState>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    toggleFiltersFullOpen: (state) => {
      state.isFilterFullOpen = !state.isFilterFullOpen;
    },
    setViewMode: (state, action: PayloadAction<'grid' | 'list'>) => {
      state.viewMode = action.payload;
    },
  },
});

export const { setFilters, toggleFiltersFullOpen, setViewMode } =
  globalSlice.actions;

export default globalSlice.reducer;
