"use client";

import { useEffect } from 'react';
import Image from 'next/image';

export default function BuyMeACoffeeButton () {
    return (
        <div className="buymeacoffee_link">
            <a href="https://buymeacoffee.com/renrocks" target='_BLANK'>
                <Image src={`bmc_qr.png`} alt="buy me a coffee link" width="64" height="64" />
            </a>
        </div>
    );
}