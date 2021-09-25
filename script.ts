type CurrencySymbol = "$" | "£";

const coins: {
    id: CurrencySymbol;
    coins: number[];
    change: string;
}[] = [
    {
        id: "£",
        coins: [1, 2, 5, 10, 20, 25, 50, 100, 200, 500, 1000],
        change: "p",
    },
    {
        id: "$",
        coins: [1, 5, 10, 25, 50, 100],
        change: "c",
    },
];

const price = <HTMLInputElement>document.getElementById("price");
const coinsElement = <HTMLDivElement>document.getElementById("coins");

price.addEventListener("keypress", preventFurtherFloatingPoints);

price.addEventListener("keyup", (e) => {
    resetCoinView();
    if (!isValidPrice(price.value)) return;

    const currencySymbol: CurrencySymbol = price.value.substring(
        0,
        1
    ) as CurrencySymbol;
    const [whole, fraction] = price.value.substring(1).split(".") as Array<
        string | undefined
    >;

    if (fraction != null && whole != null) {
        const generatedCoins = generateCoins(+whole, +fraction, currencySymbol);

        for (let coin in generatedCoins) {
            // @ts-ignore
            const value = generatedCoins[coin];

            const newElement = document.createElement("div");
            const coinName =
                +coin < 100
                    ? `${coin}${
                          coins.filter((coin) => coin.id === currencySymbol)[0]
                              .change
                      }`
                    : `${currencySymbol}${+coin / 100}`;

            if (value > 0) {
                newElement.textContent = `${coinName}: ${value}`;
            }

            coinsElement.appendChild(newElement);
        }
    }
});

function isValidPrice(priceValue: string): boolean {
    priceValue = priceValue.trim();

    return (
        (priceValue.substring(0, 1) === "$" ||
            priceValue.substring(0, 1) === "£") &&
        !isNaN(parseFloat(priceValue.substring(1)))
    );
}

function generateCoins(
    whole: number,
    fraction: number,
    currencySymbol: CurrencySymbol
): { number?: number } {
    if (fraction < 10) fraction *= 10;

    const absolute: number = fraction + whole * 100;
    const chosenCoins: number[] = coins.filter(
        (coin) => coin.id === currencySymbol
    )[0].coins;
    chosenCoins.sort((a, b) => b - a);

    const generatedCoins: { number?: number } = {};
    let absoluteCopy = absolute;

    for (let coin of chosenCoins) {
        const takenCoins = <number>Math.floor(absoluteCopy / coin);
        absoluteCopy -= takenCoins * coin;

        // @ts-ignore
        generatedCoins[coin] = takenCoins;
    }

    return generatedCoins;
}

function preventFurtherFloatingPoints(e: KeyboardEvent): void {
    if (
        price.value.substring(1).split(".")?.[0] != null &&
        price.value.substring(1).split(".")?.[1]?.length >= 2
    )
        e.preventDefault();
}

function resetCoinView(): void {
    coinsElement.textContent = "";
}
