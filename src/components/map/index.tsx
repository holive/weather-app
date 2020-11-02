import React, { useContext, useState } from 'react';
import GoogleMap from 'google-map-react';
import { initGeolocation, userPosition } from '@/user';
import { Pin } from '@/components/pin';
import { StateContext } from '@/context';
import { initialState } from '@/context/state';
import styles from './index.module.css';

const Map = () => {
  const { state, actions } = useContext(StateContext);
  const { latitude, longitude } = state.userCoordinates.coords;
  const [center, _setCenter] = useState([latitude, longitude]);

  const changePinLocation = (coords: { lat: number; lng: number }) => {
    actions.setUserCoordinates({ latitude: coords.lat, longitude: coords.lng });
  };

  const setInitialCenter = (userPosition: userPosition) => {
    if (!userPosition?.coords?.longitude) return;

    const { latitude, longitude } = userPosition.coords;

    _setCenter([latitude, longitude]);
    changePinLocation({ lat: latitude, lng: longitude });
  };

  const getUserLocation = () => window && initGeolocation(setInitialCenter);

  return (
    <div className={styles.container}>
      <GoogleMap
        center={center}
        bootstrapURLKeys={{ key: process.env.MAPS_SECRET }}
        defaultCenter={{
          lat: initialState.userCoordinates.coords.latitude,
          lng: initialState.userCoordinates.coords.longitude,
        }}
        defaultZoom={13}
        onGoogleApiLoaded={() => getUserLocation()}
        onClick={changePinLocation}
        yesIWantToUseGoogleMapApiInternals
      >
        <Pin lat={latitude} lng={longitude} />
      </GoogleMap>
    </div>
  );
};

export default Map;
