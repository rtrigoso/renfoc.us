"use client";

import { useEffect } from 'react';
import Image from 'next/image';

export default function BuyMeACoffeeButton() {
    return (
        <div className="buymeacoffee_link">
            <a href="https://www.buymeacoffee.com/renrocks" target='_BLANK'>
                <img src="https://img.buymeacoffee.com/button-api/?text=wanna buy me coffee?&emoji=🙇‍♂️&slug=renrocks&button_colour=FF5F5F&font_colour=ffffff&font_family=Comic&outline_colour=000000&coffee_colour=FFDD00" />
            </a>
        </div>
    );
}