import React, {useEffect, useState} from 'react';
import { ScatterChart , Scatter, LineChart, Line, ComposedChart, AreaChart, Area, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';
import TimeButton from './TimeButton';
import SocialButton from './SocialButton';
import Post from "../helpers/post.js";
import './Dashboard.scss';

const Dashboard = () => {
    const [matches, setMatches] = useState( window.matchMedia("(min-width: 768px)").matches )
    const [cryptoname, setcryptoName] = useState('dogecoin');
    const [fiatname, setfiatname] = useState('inr');
    const [timeSpan, setTimeSpan] = useState(365);
    const [timespanChanged, settimespanChanged] = useState(false);
    
    const [pricesArray, setPricesArray] = useState([]);
    const [tweetsArray, setTweetsArray] = useState([]);
    const [cryptoLoadDone, setcryptoLoadDone] = useState(false);
    const [tweetLoadDone, settweetLoadDone] = useState(false);

    const handleCryptoNameChange = event => { setcryptoName(event.target.value); };
    const handleFiatNameChange = event => { setfiatname(event.target.value); };

    function findTweetOnDate(date) {
        if(tweetsArray.find(o => o.date === date) === undefined) 
            return ""
        else
            return tweetsArray.find(o => o.date === date).tweet
    }
    function GetAllData() {
        console.log(`GetAllData`);
        GetCryptoPrices();
        GetElonTweets();
    }
    function GetCryptoPrices() {
        console.log(`GetCryptoPrices`);
        Post.GetCryptoPrices(cryptoname, fiatname, timeSpan)
            .then((res) => {
                console.log(`got GetCryptoPrices results`);
                setcryptoLoadDone(true);
                setPricesArray(res.cryptoArr);
            })
            .catch((err) => {
                console.log(err);
        });
    }
    function GetElonTweets() {
        console.log(`GetElonTweets`);
        Post.GetElonTweets()
            .then((res) => {
                console.log(`got GetElonTweets results`);
                settweetLoadDone(true);
                setTweetsArray(res.tweetArr);
            })
            .catch((err) => {
                console.log(err);
        });
    }

    useEffect(() => {
        console.log(`useEffect`);
        window.matchMedia("(min-width: 600px)").addEventListener('change', e => setMatches( e.matches ));
        if(!tweetLoadDone)
            GetElonTweets();
        if(!cryptoLoadDone || timeSpan)
            GetCryptoPrices();
    }, [timeSpan])

    const CustomTooltip = ({ active, payload, label }) => {
        if (active) {
            return (
                <div className="custom-tooltip">
                    {payload !== null && <p className="label">{`${payload[0].value} - ${label}`}</p>}
                    {payload !== null && <p className="label">{`${findTweetOnDate(label)}`}</p>}
                </div>
            );
        }
        return null;
    };

    return (
        <div className="dashboard">
            <div className="header">
                <p className="title">cryptoMusk</p>
                <h3 className="subtext">see the influence of the elon's tweets on crypto prices</h3>
                <div className="crptofiat_container">
                    <input className="crptofiat_input" placeholder="dogecoin" onChange={handleCryptoNameChange}></input>
                    <input className="crptofiat_input" placeholder="inr" onChange={handleFiatNameChange}></input>
                    <button className="crptofiat_button" onClick={() => GetAllData()}>Show</button>
                </div>
            </div>
            <div className='main_chart_container' >
                {(matches) &&
                    <AreaChart className="main_chart" width={1600} height={550} data={pricesArray} >
                        <defs>
                            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="40%" stopColor="#8884d8" stopOpacity={1} />
                                <stop offset="100%" stopColor="#8884d8" stopOpacity={0.1} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid vertical={false} stroke="#3b3b3b" strokeDasharray="1 1" />
                        <XAxis dataKey="date" style={{ fontFamily: 'Space Grotesk', fontSize: '0.9rem',}}/>
                        <YAxis style={{ fontFamily: 'Space Grotesk', fontSize: '0.9rem',}}/>
                        <Tooltip  content={<CustomTooltip />} wrapperStyle={{backgroundColor: "#f2cc93", color: "black", borderRadius: "3pc", fontSize: '1rem'}}/>
                        <Area type="monotone" dataKey="price" stroke="#8884d8" fill="url(#colorValue)" />
                    </AreaChart>
                }
                {(!matches) &&
                    <AreaChart className="main_chart" width={350} height={450} data={pricesArray} >
                        <defs>
                            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="40%" stopColor="#8884d8" stopOpacity={1} />
                                <stop offset="100%" stopColor="#8884d8" stopOpacity={0.1} />
                            </linearGradient>
                        </defs>
                        <Tooltip  content={<CustomTooltip />} wrapperStyle={{backgroundColor: "#f2cc93", color: "black", borderRadius: "3pc", fontSize: '1rem'}}/>
                        <Area type="monotone" dataKey="price" stroke="#8884d8" fill="url(#colorValue)" />
                    </AreaChart>
                }
            </div>
            <div className="timebutton_container">
                <TimeButton button_text="1 W" setTimeSpan={setTimeSpan} settimespanChanged={settimespanChanged} />
                <TimeButton button_text="1 M" setTimeSpan={setTimeSpan} settimespanChanged={settimespanChanged} />
                <TimeButton button_text="1 Y" setTimeSpan={setTimeSpan} settimespanChanged={settimespanChanged} />
                <TimeButton button_text="3 Y" setTimeSpan={setTimeSpan} settimespanChanged={settimespanChanged} />
                <TimeButton button_text="5 Y" setTimeSpan={setTimeSpan} settimespanChanged={settimespanChanged} />
            </div>
            <div className="socials_container">
                <SocialButton button_image="./images/twitter_icon.png" alt="Twitter" link="https://twitter.com/_silhouettte_"/>
                <SocialButton button_image="./images/site_icon.png" alt="Personal Site" link="https://nikhil-nair.web.app/"/>
                <SocialButton button_image="./images/instagram_icon.png" alt="Instagram" link="https://www.instagram.com/_nikhilnair_/"/>
            </div>
        </div>
    );
}

export default Dashboard;