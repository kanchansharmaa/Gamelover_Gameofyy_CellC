import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const Redirect = () => {
  const location = useLocation();
  const navigate = useNavigate();


  // http://gamelover.gameofyy.com/redirect?cl=AW_UW_GamesLover_R4&tn=27620044120&nt=CellC&z9ti=1031738192&rn=77578010&rc=CONFIRMED&ai=6455565284&sd=2024-05-16+10%3A55%3A11&ei=0&em=Confirmed&oerr=%7BRefId%3A1031738192%7D+%7BDoiSvc%3A0003707%7D+%7BToken%3A6455565284%7D&ext_ref=cbd67342nf348r
  useEffect(() => {
   
    const searchParams = new URLSearchParams(location.search);
    const msisdn = searchParams.get('tn'); 
    console.log("msisdn redirection", msisdn)

    if (msisdn) {
      Cookies.set('msisdn', msisdn, { expires: 1 });
      navigate('/'); 
    } else {
      console.error('No MSISDN provided!');
      navigate('/login'); 
    }
  }, [location, navigate]);

  return (
    <div>
      Redirecting...
    </div>
  );
}

export default Redirect;
