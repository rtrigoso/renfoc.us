"use client";

export default function BuyMeACoffeeButton() {
    return (
        <div className="buymeacoffee_link">
            <a
                href="https://www.buymeacoffee.com/renrocks"
                target='_BLANK'
                aria-label="Navigate to buymeacoffee.com and share a cup of joe with me">
                <img width={250}
                    height={90}
                    src="https://img.buymeacoffee.com/button-api/?text=wanna buy me coffee?&emoji=🙇‍♂️&slug=renrocks&button_colour=FF5F5F&font_colour=ffffff&font_family=Comic&outline_colour=000000&coffee_colour=FFDD00" alt="would you like to buy me coffee?" />
            </a>
        </div>
    );
}