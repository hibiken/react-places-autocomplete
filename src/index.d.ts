import * as React from "react";

export = PlacesAutocomplete;
declare namespace PlacesAutocomplete{
    export let geocodeByAddress: (address: string, callback: (errorStatus: any, location: {lat: number, lng: number} | null | undefined , results: any) => void) => void;
    export let geocodeByPlaceId: (placeId: string, callback: (errorStatus: any, location: {lat: number, lng: number} | null | undefined , results: any) => void) => void;    

    export interface PlacesAutocompleteProps{
            inputProps: Partial<HTMLInputElement> & {value: string, onChange: (value: string | null | undefined) => void},

            //Optional
            onError?: (status: any) => void,
            clearItemsOnError?: boolean,
            onSelect?: (address: string, placeId: string) => void,
            autocompleteItem?: (value: { suggestion: any, formattedSuggestion: any }) => void,
            onEnterKeyDown?: (value: string) => void,
            classNames?: {
                root: string,
                input: string,
                autocompleteContainer: string,
                autocompleteItem: string,
                autocompleteItemActive: string,
            },
            styles?: {
                root: any,
                input: any,
                autocompleteContainer: any,
                autocompleteItem: any,
                autocompleteItemActive: any
            },
            options?: {
                bounds: any,
                componentRestrictions: any,
                location: any,
                offset: number | string,
                radius: number | string,
                types: any[]
            }
    }
    
}

declare class PlacesAutocomplete extends React.Component<PlacesAutocomplete.PlacesAutocompleteProps, {}> { }