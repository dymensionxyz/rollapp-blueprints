import React, { useEffect, useRef } from 'react';

const TradingViewChartWidget = () => {
    const containerRef = useRef(null);

    useEffect(() => {
        const script = document.createElement('script');
        script.src = 'https://s3.tradingview.com/tv.js';
        script.async = true;
        script.onload = () => {
            new window.TradingView.widget({
                container_id: 'tradingview_chart',
                autosize: true,
                symbol: 'BITFINEX:BTCUSD',
                interval: 'D',
                timezone: 'Etc/UTC',
                theme: 'dark',               // Use dark mode
                style: '1',
                locale: 'en',
                toolbar_bg: '#13132a',       // Toolbar background
                enable_publishing: false,
                allow_symbol_change: false,
                hide_top_toolbar: true,
                hide_side_toolbar: true,
                details: false,
                hotlist: false,
                calendar: false,
                // Attempt to override the chart background
                overrides: {
                    "paneProperties.background": "#13132a",
                    "paneProperties.backgroundType": "solid",
                    "paneProperties.vertGridProperties.color": "#13132a",
                    "paneProperties.horzGridProperties.color": "#13132a",
                },
            });
        };

        if (containerRef.current) {
            containerRef.current.appendChild(script);
        }

        return () => {
            if (containerRef.current) {
                containerRef.current.innerHTML = '';
            }
        };
    }, []);

    return (
        <div className='h-64 bg-[rgb(19,19,42)] border border-[rgb(247,147,26)] rounded-md [box-shadow:0_0_10px_rgba(247,147,26,0.5),_0_0_20px_rgba(247,147,26,0.3),_0_0_30px_rgba(247,147,26,0.1)] overflow-hidden mt-6'>
            <div id="tradingview_chart" ref={containerRef} style={{ height: '100%' }} />
        </div>
    );
};

export default TradingViewChartWidget;
