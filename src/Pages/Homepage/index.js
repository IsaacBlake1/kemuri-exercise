import React, { useEffect, useState } from 'react';
import PostcodeForm from '../../Forms/PostcodeForm';
import Spinner from '../../Components/Spinner';
import styles from './styles.module.scss';
import axios from 'axios';

function App() {
    // local state
    const [loading, setLoading] = useState(false);
    const [coordinates, setCoordinates] = useState(null);
    const [nearbyLocations, setNearbyLocations] = useState(null);

    // Fetch wiki pages nearby when coordinates change
    useEffect(() => {
        if (coordinates) {
            axios
                .get(
                    `https://en.wikipedia.org/w/api.php?action=query&list=geosearch&gscoord=${coordinates[0]}|${coordinates[1]}&gsradius=10000&gslimit=5&format=json&origin=*`
                )
                .then((res) => {
                    // Set links to full articles
                    const updatedLocationsWithUrl = res.data.query.geosearch.map(
                        (location) => {
                            return {
                                ...location,
                                url: `https://en.wikipedia.org/wiki/${location.title}`,
                            };
                        }
                    );
                    console.log(updatedLocationsWithUrl);
                    // setNearbyLocations(updatedLocationsWithUrl);
                    const updatedLocations = [];

                    updatedLocationsWithUrl.map((location) => {
                        axios
                            .get(
                                `http://en.wikipedia.org/w/api.php?action=query&titles=${location.title}&prop=pageimages&format=json&pithumbsize=100&origin=*`
                            )
                            .then((res) => {
                                if (
                                    res.data.query.pages &&
                                    Object.values(res.data.query.pages)[0]
                                        .thumbnail
                                ) {
                                    console.log(
                                        'we got here',
                                        Object.values(res.data.query.pages)[0]
                                            .thumbnail.source
                                    );
                                    updatedLocations.push({
                                        ...location,
                                        image: Object.values(
                                            res.data.query.pages
                                        )[0].thumbnail.source,
                                    });
                                } else {
                                    updatedLocations.push({
                                        ...location,
                                    });
                                }
                                console.log(
                                    updatedLocations.length,
                                    updatedLocationsWithUrl.length
                                );
                                if (
                                    updatedLocations.length ===
                                    updatedLocationsWithUrl.length
                                ) {
                                    console.log('heres the problem');
                                    setNearbyLocations(updatedLocations);
                                }
                            });
                    });

                    setLoading(false);
                })
                .catch((err) => {
                    setLoading(false);
                });
        }
    }, [coordinates]);

    console.log('the locations', nearbyLocations);

    const onSubmitPostcode = (postcode) => {
        setLoading(true);
        axios
            .get(`https://api.postcodes.io/postcodes/${postcode}`)
            .then((res) => {
                console.log(res);
                setCoordinates([
                    res.data.result.latitude,
                    res.data.result.longitude,
                ]);
            })
            .catch((err) => {
                setLoading(false);
                console.log(err);
            });
    };

    return (
        <div className={styles.container}>
            {loading && <Spinner />}
            <PostcodeForm onSubmit={onSubmitPostcode} />
            {nearbyLocations &&
                nearbyLocations.map((location) => (
                    <div
                        className={styles.attraction}
                        key={location.pageid}
                        onClick={() => window.open(location.url, '_blank')}
                    >
                        <img src={location.image} />
                        <div>Location: {location.title}</div>
                        <div>Distance: {location.dist}m</div>
                    </div>
                ))}
        </div>
    );
}

export default App;
