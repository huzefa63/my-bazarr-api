export function formatCurrency(amt){
    const forAmt = new Intl.NumberFormat('en-IN',{
        style:'currency',
        currency:"INR",
    }).format(amt);
    return forAmt;
}