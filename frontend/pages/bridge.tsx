import React from 'react'
import Head from 'next/head'
import { Text, Spacer, Container,Button } from '@nextui-org/react'
import { Image } from "@nextui-org/react";
import styles from '../styles/MintPage.module.css'
import Header from '../components/Header'
import MintButton from '../components/MintButton'
import { useState } from 'react';
import NFTimage from '../components/NFTimage';

interface NFTData {
    name: string
    description: string
    tokenId: string
    image_url: string
}

var list;

const BridgePage = () => {

    const [nfts, setNFTs] = useState<NFTData[]>([])

    const hogehoge = async () => {
        const options = {method: 'GET'};

fetch('https://testnets-api.opensea.io/api/v1/assets?owner=0x20f115dce7452A853824f302d8985aaCB645C4a9&order_direction=desc&offset=0&limit=20&include_orders=false', options)
  .then(response => response.json())
  .then(response => {
    const r = response["assets"] as NFTData[]
    setNFTs(r)

    console.log(r[0].image_url)
  })
  .catch(err => console.error(err));
    }

    React.useEffect(() => {
        // 関数を実行する処理
        const options = {method: 'GET'};
    
        fetch('https://testnets-api.opensea.io/api/v1/assets?owner=0x20f115dce7452A853824f302d8985aaCB645C4a9&order_direction=desc&offset=0&limit=20&include_orders=false', options)
          .then(response => response.json())
          .then(response => {
            const r = response["assets"] as NFTData[]
            console.log(r[0].image_url)
          })
          .catch(err => console.error(err));
      }, []);
  return (
    <div>
    <Button onClick={hogehoge}>Mint test NFT</Button>

    <div className={styles.images}>
    <Image 
    height={200}
    width={200}
    src='https://i.seadn.io/gae/hslSH9h-Wj0PA_4wHHwAonJHlaZ0qYQCvvrQvjBWC6jQ4hFK3YNr96vhSWlh4KgJSbaBUIo8jBjQRLZ48weL6Vx_CdCKS_h3SPqvXQ?w=500&auto=format'
    />
            <ul className='md:flex '>
          {nfts.map((value, index) => (
                <Image 
                height={200}
                width={200}
                src={value.image_url}
                />
          ))}
        </ul>
    </div>
    </div>
  )
}

export default BridgePage