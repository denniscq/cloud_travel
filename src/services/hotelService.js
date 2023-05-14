import axios from 'axios';

/**
 * @description get data from remote api
 */
export default {
  getHotels: (city) => axios.get(`https://hiring.zumata.xyz/job01/search/${city}`),
  getCitys: async () => {
    try {
      const res = await axios.get('https://hiring.zumata.xyz/job01/autosuggest');
      return res.data;
    } catch (error) {
      console.error(`an error has been occurred while getting cicty from remote api, the details is ${error}`);
      throw error;
    }
  },
};
