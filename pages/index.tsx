import Image from "next/image";
import { Inter } from "next/font/google";
import axios from "axios";
import Method from "axios/index.d";
import { useEffect, useState } from "react";

const inter = Inter({ subsets: ["latin"] });

type Method =
  | "get"
  | "GET"
  | "delete"
  | "DELETE"
  | "head"
  | "HEAD"
  | "options"
  | "OPTIONS"
  | "post"
  | "POST"
  | "put"
  | "PUT"
  | "patch"
  | "PATCH"
  | "purge"
  | "PURGE"
  | "link"
  | "LINK"
  | "unlink"
  | "UNLINK";

interface GetQuoteConfig {
  method?: Method;
  url?: string;
  params: {
    token?: string;
  };
  withCredentials?: boolean;
}
interface GetCompanyConfig {
  method?: Method;
  url?: string;
  params?: {
    token?: string;
    last: number;
  };
  withCredentials?: boolean;
}
export default function Home() {
  const [stockName, setStockName] = useState("");
  const [payloadStockName, setPayloadStockName] = useState("");
  const [payloadStockExchange, setPayloadStockExchange] = useState("");
  const [payloadStockSymbol, setPayloadStockSymbol] = useState("");
  const [payloadIndustry, setPayloadIndustry] = useState("");
  const [payloadSector, setPayloadSector] = useState("");
  const [payloadMarketCap, setPayloadMarketCap] = useState("");
  const [payloadLongDesc, setPayloadLongDesc] = useState("");

  const GPTstockPayload = {
    CompanyOverview: {
      name: payloadStockName,
      exchange: payloadStockExchange,
      tickerSymbol: payloadStockSymbol,
      industry: payloadIndustry,
      sector: payloadSector,
      marketCapitalization: payloadMarketCap,
      LongDescription: payloadLongDesc,
    },
  };

  async function getStockQuote(key: string, stockName: string) {
    try {
      const getQuoteConfig: GetQuoteConfig = {
        method: "get",
        url: `https://api.iex.cloud/v1/data/CORE/QUOTE/${stockName}`,
        params: {
          token: "sk_649b65c2e2794bf6a6104dde4c9392b4",
        },
        withCredentials: false,
      };

      const getQuoteIEXresponse = await axios(getQuoteConfig);
      console.log(getQuoteIEXresponse.data[0]);
      console.log("getQuoteFetch!");
      return "OK";
    } catch (e) {
      console.log(`getQuote Error with ${e}`);
    }
  }

  async function getCompany(key: string, stockName: string) {
    try {
      const getCompanyConfig: GetCompanyConfig = {
        method: "get",
        url: `https://api.iex.cloud/v1/data/CORE/COMPANY/${stockName}`,
        params: {
          token: "sk_649b65c2e2794bf6a6104dde4c9392b4",
          last: 1,
        },
        withCredentials: false,
      };

      const getCompanyResponse = await axios(getCompanyConfig);
      console.log(getCompanyResponse);

      // construct payload

      if (getCompanyResponse.data[0].companyName) {
        setPayloadStockName(getCompanyResponse.data[0].companyName);
      }
      if (getCompanyResponse.data[0].symbol) {
        setPayloadStockSymbol(getCompanyResponse.data[0].symbol);
      }
      if (getCompanyResponse.data[0].exchange) {
        setPayloadStockExchange(getCompanyResponse.data[0].exchange);
      }
      if (getCompanyResponse.data[0].industry) {
        setPayloadIndustry(getCompanyResponse.data[0].industry);
      }
      if (getCompanyResponse.data[0].sector) {
        setPayloadSector(getCompanyResponse.data[0].sector);
      }
      if (getCompanyResponse.data[0].marketcap) {
        setPayloadMarketCap(getCompanyResponse.data[0].marketcap);
      }
      if (getCompanyResponse.data[0].longDescription) {
        setPayloadLongDesc(getCompanyResponse.data[0].longDescription);
      }
    } catch (e) {
      console.log(`getCompany Error with ${e}`);
    }
  }

  return (
    <>
      <form>
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            Stock Name
          </label>
          <input
            type="text"
            id="stockName"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            onChange={(event) => {
              setStockName(event.currentTarget.value);
            }}
          ></input>
        </div>
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={(event) => {
            event.preventDefault();
            // getStockQuote(process.env.REACT_APP_IEXKEY!, stockName);
            getCompany(process.env.REACT_APP_IEXKEY!, stockName);
          }}
        >
          Get Stock Quote
        </button>
        <button
          onClick={(event) => {
            event.preventDefault();
            console.log(GPTstockPayload);
          }}
        >
          Show payload
        </button>
      </form>
    </>
  );
}
