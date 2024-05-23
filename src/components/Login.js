import React , {useState} from 'react'
import logo from '../assets/images/gamelogo.png'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from  'js-cookie'
const Login = () => {

    const [msisdn, setMsisdn] = useState('');
    const navigate=useNavigate()

    const handleMsisdnChange = (e) => {
        setMsisdn(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
    
        // Initialize the variable for the formatted msisdn
        let formattedMsisdn = msisdn;
    
        // Check if msisdn starts with '0', remove '0' and prepend '27'
        if (msisdn.startsWith('0')) {
            formattedMsisdn = '27' + msisdn.slice(1);
        }
        // If msisdn does not start with '27', prepend '27'
        if (!msisdn.startsWith('27') && !msisdn.startsWith('0')) {
            formattedMsisdn = '27' + msisdn;
        }
    
    console.log("mskjcjiefcwe", formattedMsisdn)
        axios.get(`/checkuser?msisdn=${formattedMsisdn}`)
            .then(response => {
                console.log("response data", response.data);
                if (response.data.statusId == '1') {
                    Cookies.set('msisdn', formattedMsisdn, { expires: 1 });
                    navigate(`/`);
                } else {
                    setMsisdn('');
                    navigate('/login');
                }
            })
            .catch(error => {
                console.error('Error checking user:', error);
                navigate('/');
            });
    };
    
    
    
    


    return (
        <div className='bg-[#623193] h-screen'>

            <div className='container mx-auto flex flex-col justify-center py-[90px]'>
                <div className=' mx-auto'>
                    <img class="rounded-t-lg h-10" src={logo} alt="" />
                </div>
                <div className='flex justify-center py-3'>
                    <div class="max-w-sm bg-white border border-gray-200 rounded-lg shadow ">

                        <div class="p-5 shadow-xl shadow-purple-600 ">


                            <div class="w-full max-w-sm p-2  bg-white border border-gray-200 rounded-lg shadow sm:p-6 md:p-8 ">
                                <form class="space-y-4" action="#" onSubmit={handleSubmit}>
                                    <h5 class="text-2xl  text-[#6B57EF] font-bold text-center capitalize ">SIGN IN TO ENJOY !</h5>
                                    <div>
                                        <label for="number" class="block mb-2 text-sm font-medium text-gray-700 ">Enter Number</label>
                                        <input type="number" name="number" id="number" value={msisdn} onChange={handleMsisdnChange} class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 
                                        focus:border-blue-500 block w-full p-2.5
                                         " placeholder="*********" required />
                                    </div>



                                    <button type="submit" class="w-full text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300  font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2">Login</button>

                                </form>
                            </div>

                        </div>
                    </div>
                </div>

            </div>

        </div>
    )
}

export default Login
