"use client";

import ReactCompareImage from 'react-compare-image';

export const CompareImage = () => {
    return (
        <div style={{
            borderRadius: '8px',
            overflow: 'hidden',
            border: '2px solid rgba(255, 255, 255, 0.1)',
            width: '100%',
            maxWidth: '1200px',
            margin: '0 auto',
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        }}>
            <div style={{ width: '100%', height: '100%' }}>
                <ReactCompareImage
                    leftImage="/images/Comp1.png"
                    rightImage="/images/Comp2.png"
                    sliderPositionPercentage={0.3}
                    sliderLineColor='#000'
                    sliderLineWidth={3}
                    handle={
                        <>
                            <div style={{
                                width: '200px',
                                background: 'linear-gradient(to left, transparent, rgba(0, 0, 0, 0.1) 30%, rgba(0, 0, 0, 0.1) 30%, transparent)',
                                position: 'absolute',
                                top: 0,
                                bottom: 0,
                                height: '100%',
                                backdropFilter: 'blur(1.5px)',
                                WebkitBackdropFilter: 'blur(1.5px)',
                                left: '-100px',
                                transition: 'all 0.3s ease',
                                pointerEvents: 'none',
                                opacity: 0.7
                            }} />
                        </>
                    }
                />
            </div>
        </div>
    );
};