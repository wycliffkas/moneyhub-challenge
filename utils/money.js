export const formatAmount = (amount) => {
	return new Intl.NumberFormat("en-GB", {
		style: "currency",
		currency: "GBP"
	}).format(amount);
};
