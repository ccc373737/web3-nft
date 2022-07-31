import React, { useState, useEffect } from "react";

const useCountdown = (targetDate: number) => {
    const countDownDate = new Date(targetDate).getTime();

    const [countDown, setCountDown] = useState(
        countDownDate - new Date().getTime()
    );

    useEffect(() => {
        const interval = setInterval(() => {
            setCountDown(countDownDate - new Date().getTime());
        }, 1000);

        return () => clearInterval(interval);
    }, [countDownDate]);

    return getReturnValues(countDown);
};

const getReturnValues = (countDown: number) => {
    // calculate time left
    const days = Math.floor(countDown / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
        (countDown % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutes = Math.floor((countDown % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((countDown % (1000 * 60)) / 1000);

    return [days, hours, minutes, seconds];
};

const CountdownTimer = ({ targetDate }: { targetDate: number }) => {
    const [days, hours, minutes, seconds] = useCountdown(targetDate);

    if (days + hours + minutes + seconds <= 0) {
        return (
            <div>
                <span>Time is over 🔥</span>
            </div>
        )
    } else {
        return (
            <div>
                <span style={{ fontSize: '30px' }}>{days}</span>
                <span>d</span>
                <span style={{ fontSize: '30px', marginLeft: '10px' }}>{hours}</span>
                <span>h</span>
                <span style={{ fontSize: '30px', marginLeft: '10px' }}>{minutes}</span>
                <span>m</span>
                <span style={{ fontSize: '30px', marginLeft: '10px' }}>{seconds}</span>
                <span>s</span>
            </div>
        )
    }
};

export default CountdownTimer;