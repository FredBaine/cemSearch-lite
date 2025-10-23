import { Component, OnInit, AfterViewInit, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as L from 'leaflet';
import { Firestore, collection, query, where, getDocs, doc, getDoc } from '@angular/fire/firestore';
import { ActivatedRoute, Router } from '@angular/router';
import { SearchStateService } from '../../services/search-state.service';
import { LocationGroup } from '../../types/locations';

@Component({
  selector: 'app-map',
  imports: [CommonModule],
  templateUrl: './map.component.html',
  styleUrl: './map.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MapComponent implements OnInit, AfterViewInit {
  private map!: L.Map;
  private bounds: L.LatLngBoundsExpression = [
    [33.517465791070336, -90.16460389330437],    // Southern/Western points
    [33.513765620952874, -90.16167553040486]  // Northern/Eastern points
  ];
  section!: string;
  lot!: string;
  showBackButton = false;

  private firestore = inject(Firestore);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private searchStateService = inject(SearchStateService);

  private toProperCase(str: string): string {
    if (!str) return str;
    return str.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase());
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.section = params['section'];
      this.lot = params['lot'];
    });
    
    // Check if navigated from search component
    if (history.state && history.state.fromSearch) {
      this.showBackButton = true;
      console.log('Navigated to map from search component');
    }
  }

  goBackToSearch(): void {
    this.router.navigate(['/search']);
  }

  ngAfterViewInit(): void {
    this.initMap();
    // Draw rectangle after map is initialized
    if (this.section && this.lot) {
      setTimeout(() => {
        this.drawRectangle();
      }, 100);
    }
  }

  private initMap(): void {
    console.log('Initializing map...');
    
    const mapElement = document.getElementById('map');
    if (!mapElement) {
      console.error('Map element not found!');
      return;
    }

    this.map = L.map('map', {
      crs: L.CRS.Simple,
      zoom: 17.5,
      center: [33.51544922792399, -90.1634125075384],
      zoomDelta: 0.1,
      zoomSnap: 0.1,
      zoomControl: false,
      attributionControl: false,
      scrollWheelZoom: false,
      maxBounds: this.bounds
    });

    console.log('Map created:', this.map);

    const imageUrl = 'assets/carrolltonSat.png';
    const imageOverlay = L.imageOverlay(imageUrl, this.bounds);
    imageOverlay.addTo(this.map);

    // Fit bounds to show the entire image
    this.map.fitBounds(this.bounds, { padding: [20, 20] });

    // Optional: Add click handler to get coordinates
    this.map.on('click', (e: L.LeafletMouseEvent) => {
      console.log('Clicked coordinates:', e.latlng);
    });

    this.map.on('zoom', (e: L.LeafletEvent) => {
      const zoomLevel = this.map.getZoom();
      console.log('zoomLevel:', zoomLevel); 
    });

    console.log('Map initialization complete');
  }


  async drawRectangle() {
    console.log('Drawing rectangle for section:', this.section, 'lot:', this.lot);
    
    if (!this.map) {
      console.error('Map not initialized yet');
      return;
    }

    try {
      const locationsCollection = collection(this.firestore, 'locations');
      // Use the document ID directly for efficient lookup
      const locationId = `${this.section}-${this.lot}`;
      const locationDocRef = doc(this.firestore, 'locations', locationId);
      const locationDoc = await getDoc(locationDocRef);
      
      console.log('Document lookup for id:', locationId, 'exists:', locationDoc.exists());
      
      if (locationDoc.exists()) {
        const location = locationDoc.data() as LocationGroup;
        console.log('Location data:', location);
        
        // Check if coordinates exist
        if (!location.coordinates) {
          console.error('No coordinates found for location:', locationId);
          return;
        }
        
        const bounds: L.LatLngBoundsExpression = [
          [location.coordinates.southWest.lat, location.coordinates.southWest.lng],
          [location.coordinates.northEast.lat, location.coordinates.northEast.lng]
        ];
  
        const rectangle = L.rectangle(bounds, {
          color: '#FF4081',
          weight: 2,
          fillColor: '#FF4081',
          fillOpacity: 0.3
        });
  
        rectangle.addTo(this.map);
        console.log('Rectangle added to map');
        
        // Center map on the rectangle
        // this.map.fitBounds(bounds, {
        //   padding: [50, 50],
        //   maxZoom: 19
        // });

      } else {
        console.log('No location data found for id:', locationId, '(section:', this.section, 'lot:', this.lot, ')');
      }
    } catch (error) {
      console.error('Error fetching location:', error);
    }
}
}