import { Routes } from '@angular/router';
import { authGuard } from './guards/auth-guard';
import { Login } from './components/login/login';
import { Register } from './components/register/register';
import { Home } from './components/home/home';
import { Profile } from './components/user/profile/profile';
import { Recommendations } from './components/user/recommend/recommend';
import { Movies } from './components/movies/movies';
import { Movie } from './components/movie/movie';

export const routes: Routes = [
    { 
        path: '', 
        component: Home 
    },
    { 
        path: 'login', 
        component: Login 
    },
    { 
        path: 'register', 
        component: Register 
    },
    {
        path: 'user',
        canActivate: [authGuard],
        children: [
            {
                path: 'profile',
                component: Profile
            }, 
            {
                path: 'recommend',
                component: Recommendations
            }
        ]
    },
    {
        path: 'movies',
        component: Movies
    },
    {
        path: 'movies/:id',
        component: Movie
    }
];
