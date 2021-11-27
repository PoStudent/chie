/* eslint-disable import/no-unresolved */
import { AzureFunction, Context } from '@azure/functions';
import axios from 'axios';

const tokenUrl = `https://${process.env.TRANSLATION_REGION}.api.cognitive.microsoft.com/sts/v1.0/issuetoken`;

const httpTrigger: AzureFunction = async (context: Context): Promise<void> => {
  const { data } = await axios.post(tokenUrl, null, {
    headers: {
      'Ocp-Apim-Subscription-Key': process.env.TRANSLATION_KEY,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
  context.res = {
    body: { token: data, region: process.env.TRANSLATION_REGION },
  };
};

export default httpTrigger;
