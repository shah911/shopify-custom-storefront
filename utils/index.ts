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
