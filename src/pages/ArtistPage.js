import { Suspense } from 'react';


export default function ArtistPage({ artist }) {
    return (
        <>
            <h1>{artist.name}</h1>
            <Suspense fallback={<AlbumsGlimmer />}>

            </Suspense>
        </>
    );
}

function AlbumsGlimmer() {
    return (
        <div className="glimmer-panel">
            <div className="glimmer-line" />
            <div className="glimmer-line" />
            <div className="glimmer-line" />
        </div>
    );
}
