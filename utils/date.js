import { add, format, differenceInYears, parse } from "date-fns";

export const formatDate = (date, dateFormat) => format(date, dateFormat);

export const calDiffInYears = (date, dateFormat) => {
	return differenceInYears(new Date(), parse(date, dateFormat, new Date()));
};
