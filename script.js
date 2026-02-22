const themeToggle = document.getElementById('theme-toggle');
const setTheme = theme => {
    document.documentElement.dataset.theme = theme;
    if (themeToggle) {
        themeToggle.setAttribute('aria-pressed', theme === 'dark');
        const label = themeToggle.querySelector('.theme-label');
        if (label) {
            label.textContent = theme === 'dark' ? 'Light' : 'Dark';
        }

        const indicator = themeToggle.querySelector('.theme-indicator');
        if (indicator) {
            indicator.textContent = theme === 'dark' ? '🌞' : '🌙';
        }
    }
};

const getInitialTheme = () => {
    const stored = localStorage.getItem('theme');
    if (stored === 'light' || stored === 'dark') {
        return stored;
    }
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light';
};

const initialTheme = getInitialTheme();
setTheme(initialTheme);

if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        const nextTheme = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
        localStorage.setItem('theme', nextTheme);
        setTheme(nextTheme);
    });
}

// Smooth scrolling for anchor links (if you add any in the future)
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Add active class to current navigation item
const currentPage = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('nav a').forEach(link => {
    if (link.getAttribute('href') === currentPage) {
        link.classList.add('active');
    }
});

// Travel Map Initialization

// Icons

// TODO: Different marker icons for different tags (have a default icon)
// Placeholder for future custom icons
const vacationIcon = L.icon({
    iconUrl: 'images/icons/VacationIcon.png',
    iconSize: [32, 32],     // width, height
    iconAnchor: [16, 32],   // point of the icon that sits on the lat/lng
    popupAnchor: [0, -32]   // popup offset
});

const friendsIcon = L.icon({
    iconUrl: 'images/icons/FriendsIcon.png',
    iconSize: [32, 32],     // width, height
    iconAnchor: [16, 32],   // point of the icon that sits on the lat/lng
    popupAnchor: [0, -32]   // popup offset
});

const childhoodIcon = L.icon({
    iconUrl: 'images/icons/ChildhoodIcon.png',
    iconSize: [32, 32],     // width, height
    iconAnchor: [16, 32],   // point of the icon that sits on the lat/lng
    popupAnchor: [0, -32]   // popup offset
});

const familyIcon = L.icon({
    iconUrl: 'images/icons/FamilyIcon.png',
    iconSize: [32, 32],     // width, height
    iconAnchor: [16, 32],   // point of the icon that sits on the lat/lng
    popupAnchor: [0, -32]   // popup offset
});

const workIcon = L.icon({
    iconUrl: 'images/icons/WorkIcon.png',
    iconSize: [32, 32],     // width, height
    iconAnchor: [16, 32],   // point of the icon that sits on the lat/lng
    popupAnchor: [0, -32]   // popup offset
});

const concertIcon = L.icon({
    iconUrl: 'images/icons/ConcertIcon.png',
    iconSize: [32, 32],     // width, height
    iconAnchor: [16, 32],   // point of the icon that sits on the lat/lng
    popupAnchor: [0, -32]   // popup offset
});

const skiIcon = L.icon({
iconUrl: 'images/icons/SkiIcon.png',
    iconSize: [32, 32],     // width, height
    iconAnchor: [16, 32],   // point of the icon that sits on the lat/lng
    popupAnchor: [0, -32]   // popup offset
});

const historyIcon = L.icon({
iconUrl: 'images/icons/HistoryIcon.png',
    iconSize: [32, 32],     // width, height
    iconAnchor: [16, 32],   // point of the icon that sits on the lat/lng
    popupAnchor: [0, -32]   // popup offset
});

const travelMapElement = document.getElementById('travel-map');
const travelListElement = document.getElementById('travel-list');
const travelFallbackElement = document.getElementById('map-fallback');

const buildTagList = tags => {
    if (!Array.isArray(tags) || !tags.length) {
        return null;
    }

    const list = document.createElement('div');
    list.className = 'travel-tags';
    tags.forEach(tag => {
        const pill = document.createElement('span');
        pill.className = 'travel-tag';
        pill.textContent = tag;
        list.appendChild(pill);
    });

    return list;
};

const buildPopupContent = place => {
    const wrapper = document.createElement('div');

    if (place.city && place.country) {
        const city = document.createElement('strong');
        city.className = 'travel-city-popup';
        city.textContent = place.city + ', ' + place.country;
        wrapper.appendChild(city);
    }

    if (place.date) {
        const date = document.createElement('div');
        date.className = 'travel-meta-popup';
        date.textContent = place.date;
        wrapper.appendChild(date);
    }

    if (place.description) {
        const description = document.createElement('div');
        description.className = 'travel-description-popup';
        description.textContent = place.description;
        wrapper.appendChild(description);
    }

    const popupTags = buildTagList(place.tags);
    if (popupTags) {
        wrapper.appendChild(popupTags);
    }

    if (place.place) {
        const placeLine = document.createElement('div');
        placeLine.className = 'travel-place-popup';
        placeLine.textContent = place.place;
        wrapper.appendChild(placeLine);
    }

    return wrapper;
};

const renderTravelList = places => {
    if (!travelListElement) {
        return;
    }

    travelListElement.innerHTML = '';

    if (!places.length) {
        const emptyState = document.createElement('p');
        emptyState.textContent = 'Add your first destination in travel-data.json to show it here.';
        travelListElement.appendChild(emptyState);
        return;
    }
    places.forEach(place => {
        const item = document.createElement('div');
        item.className = 'travel-item';

        const marker = document.createElement('span');
        marker.className = 'travel-marker';
        marker.textContent = '*';
        item.appendChild(marker);

        const text = document.createElement('div');
        if (place.city && place.country) {
            const city = document.createElement('strong');
            city.className = 'travel-city';
            city.textContent = place.city + ', ' + place.country;
            text.appendChild(city);
        }

        if (place.date) {
            const date = document.createElement('div');
            date.className = 'travel-meta';
            date.textContent = place.date;
            text.appendChild(date);
        }

        if (place.description) {
            const description = document.createElement('p');
            description.className = 'travel-description';
            description.textContent = place.description;
            text.appendChild(description);
        }

        const tagList = buildTagList(place.tags);
        if (tagList) {
            text.appendChild(tagList);
        }

        if (place.place) {
            const placeLine = document.createElement('div');
            placeLine.className = 'travel-place';
            placeLine.textContent = place.place;
            text.appendChild(placeLine);
        }

        item.appendChild(text);
        travelListElement.appendChild(item);
    });
};

const initTravelMap = async () => {
    if (!travelMapElement || !travelListElement) {
        return;
    }

    try {
        const response = await fetch('travel-data.json', { cache: 'no-store' });
        if (!response.ok) {
            throw new Error('Failed to load travel data.');
        }

        const payload = await response.json();
        const places = Array.isArray(payload.places)
            ? payload.places.flat().filter(place => place && typeof place === 'object')
            : [];
        const sortedPlaces = [...places].sort((a, b) => new Date(b.fulldate) - new Date(a.fulldate));
        renderTravelList(sortedPlaces);

        if (!window.L || !sortedPlaces.length) {
            return;
        }

        const map = L.map(travelMapElement, {
            scrollWheelZoom: true
        });

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; OpenStreetMap contributors'
        }).addTo(map);

        const mapPoints = sortedPlaces
            .filter(place => Number.isFinite(place.lat) && Number.isFinite(place.lng))
            .map(place => [place.lat, place.lng]);

        if (mapPoints.length) {
            const bounds = L.latLngBounds(mapPoints);
            map.fitBounds(bounds, { padding: [40, 40] });
        }

        sortedPlaces.forEach(place => {
            if (!Number.isFinite(place.lat) || !Number.isFinite(place.lng)) {
                return;
            }
            
            // TODO: Hierarchy of different marker icons based on tags - can only pick one icon per place
            if (place.tags && place.tags.includes('Ski')) {
                const marker = L.marker([place.lat, place.lng], { icon: skiIcon }).addTo(map);
                marker.bindPopup(buildPopupContent(place));
                return;
            } else if (place.tags && place.tags.includes('Childhood')) {
                const marker = L.marker([place.lat, place.lng], { icon: childhoodIcon }).addTo(map);
                marker.bindPopup(buildPopupContent(place));
                return;
            } else if (place.tags && place.tags.includes('History')) {
                const marker = L.marker([place.lat, place.lng], { icon: historyIcon }).addTo(map);
                marker.bindPopup(buildPopupContent(place));
                return;
            } else if (place.tags && place.tags.includes('Concert')) {
                const marker = L.marker([place.lat, place.lng], { icon: concertIcon }).addTo(map);
                marker.bindPopup(buildPopupContent(place));
                return;
            } else if (place.tags && place.tags.includes('Vacation')) {
                const marker = L.marker([place.lat, place.lng], { icon: vacationIcon }).addTo(map);
                marker.bindPopup(buildPopupContent(place));
                return;
            } else if (place.tags && place.tags.includes('Friends')) {
                const marker = L.marker([place.lat, place.lng], { icon: friendsIcon }).addTo(map);
                marker.bindPopup(buildPopupContent(place));
                return;
            } else if (place.tags && place.tags.includes('Family')) {
                const marker = L.marker([place.lat, place.lng], { icon: familyIcon }).addTo(map);
                marker.bindPopup(buildPopupContent(place));
                return;
            } else if (place.tags && place.tags.includes('Work')) {
                const marker = L.marker([place.lat, place.lng], { icon: workIcon }).addTo(map);
                marker.bindPopup(buildPopupContent(place));
                return;
            } else {
                // Default marker
                const marker = L.marker([place.lat, place.lng]).addTo(map);
                marker.bindPopup(buildPopupContent(place));
                return;
            }
        });
        if (travelFallbackElement) {
            travelFallbackElement.hidden = true;
        }
    } catch (error) {
        renderTravelList([]);
        if (travelFallbackElement) {
            travelFallbackElement.textContent = 'Unable to load map data right now.';
        }
    }
};

initTravelMap();


