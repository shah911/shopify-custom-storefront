export async function storeFront(
  query: string,
  variables: Record<string, unknown> = {}
): Promise<any> {
  try {
    const response = await fetch(process.env.NEXT_PUBLIC_API_URL!, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token":
          process.env.NEXT_PUBLIC_ACCESS_TOKEN!,
      },
      body: JSON.stringify({ query, variables }),
    });
    return response.json();
  } catch (error: any) {
    console.error(error);
    return {
      error,
    };
  }
}

export function formatUSD(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

export function readableDate(isoString: string) {
  const date = new Date(isoString);
  return date.toISOString().split("T")[0];
}

export function formatToCurrency(num: number) {
  // Convert the number to a string and split into integer and decimal parts
  const [integerPart, decimalPart] = num.toString().split(".");

  // Format the integer part with commas
  const formattedIntegerPart = integerPart.replace(
    /\B(?=(\d{3})+(?!\d))/g,
    ","
  );

  // Return the formatted number, appending the decimal part if it exists
  return decimalPart
    ? `${formattedIntegerPart}.${decimalPart}`
    : formattedIntegerPart;
}
