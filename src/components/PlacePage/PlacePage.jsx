import './style.css';

import mapLogo from '/map.png';
import starLogo from '/star.png';
import plusLogo from '/plus.png';
import userLogo from '/user.png';

import { useEffect, useState } from 'react';

export function PlacePage({ id }) {
    const [data, setData] = useState();
    const [reviewData, setReviewData] = useState();
    const [ratingData, setRatingData] = useState();
    const [reviewTextData, setReviewTextData] = useState();
    const [errorData, setErrorData] = useState();

    useEffect(() => {
        fetchData(id);

        fetchReviews(id);
    }, [id]);

    const fetchData = async (id) => {
        try {
            const response = await fetch(`https://konkursas.kitm.lt/backend/1434355/api/v1/places/${id}`, {
                method: 'GET'
            });

            const resp = await response.json();

            setData(resp);
        } catch (err) {
            console.log(err);
        }
    };

    const fetchReviews = async (id) => {
        try {
            const response = await fetch(`https://konkursas.kitm.lt/backend/1434355/api/v1/places/${id}/reviews`, {
                method: 'GET'
            });

            const resp = await response.json();

            setReviewData(resp);
        } catch (err) {
            console.log(err);
        }
    };

    async function postReview() {
        if (!ratingData || ratingData === null || ratingData === undefined) return setErrorData('Trūksta reitingo!');

        if (!reviewTextData || reviewTextData === null || reviewTextData === undefined) return setErrorData('Trūksta atsiliepimo!');

        try {
            const response = await fetch(`https://konkursas.kitm.lt/backend/1434355/api/v1/places/${id}/reviews`, {
                method: 'POST',
                body: JSON.stringify({
                    comment: reviewTextData,
                    rating: ratingData,
                    user_name: "Jonas"
                })
            });

            const resp = await response.json();

            console.log(resp);
        } catch (err) {
            console.log(err);
        }
    }

    return (
        <div className='place-page-div'>
            <div className='place-page-title-div'>
                <h1>{data?.name}</h1>
            </div>
            <div className='place-page-location-div'>
                <img src={mapLogo} alt='Map' draggable='false' />
                <p>{data?.address}</p>
            </div>
            <div className='place-page-rating-div'>
                <img src={starLogo} alt='Star' draggable='false' />
                <p>{data?.rating} / 5</p>
            </div>
            <div className='place-page-reviews-div'>
                {errorData ? <div className='error-div'>
                    <p>{errorData}</p>
                    <img onClick={() => setErrorData('')} src={plusLogo} alt='Close' draggable='false' />
                </div> : ''}
                <p>{reviewData?.total} Atsiliepimai</p>
                <div className='leave-review-div'>
                    <h2>Palik atsiliepimą</h2>
                    <div className='review-post-div'>
                        <input onChange={(event) => setReviewTextData(event.target.value)} type='text' />
                        <button onClick={() => postReview()}>Išsaugoti</button>
                    </div>
                    <div className='rating-post-div'>
                        <h3>Kiek žvaigždučių duotumėte?</h3>
                        <input onChange={(event) => setRatingData(event.target.value)} type='number' max={5} min={0} />
                    </div>
                </div>
                {reviewData?.data && reviewData?.data.map((item, index) => (
                    <div key={index} className='review-div'>
                        <div className='user-div'>
                            <img src={userLogo} alt={item.user_name} draggable='false' />
                            <p>{item.user_name}</p>
                            <p>-</p>
                            <p>Paskelbta {item.created_at}</p>
                        </div>
                        <div className='user-rating-div'>
                            <p>{item.rating} / 5</p>
                        </div>
                        <div className='user-comment-div'>
                            <p>{item.comment}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}