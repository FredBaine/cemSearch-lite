import { Routes } from '@angular/router';
import { SplashScreenComponent } from './components/splash-screen/splash-screen.component';
import { MapComponent } from './components/map/map.component';
import { SearchComponent } from './components/search/search.component';

export const routes: Routes = [
    { path: '', component: SplashScreenComponent },
    { path: 'map/:section/:lot', component: MapComponent },
    { path: 'search', component: SearchComponent },
    { path: '**', redirectTo: 'draw'}
];
