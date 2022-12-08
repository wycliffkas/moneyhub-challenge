/* eslint-disable max-statements */
import { add, format } from "date-fns";
import React from "react";
import useSWR from "swr";

import { Button } from "../../components/button";
import RowContainer from "../../components/row-container";
import {
	AccountHeadline,
	AccountLabel,
	AccountList,
	AccountListItem,
	AccountSection,
	InfoText,
	Inset,
	Badge
} from "./style";
import { formatAmount } from "../../utils/money";
import { formatDate, calDiffInYears } from "../../utils/date";

const fetcher = (...args) => fetch(...args).then((res) => res.json());

const Detail = ({}) => {
	const { data, error } = useSWR("/api/account", fetcher);

	if (error) return <div>Failed to load</div>;

	if (!data) return <div>Loading...</div>;

	const account = data.account;

	let mortgage;
	const lastUpdate = new Date(account.lastUpdate);
	if (account.associatedMortgages.length) {
		mortgage = account.associatedMortgages[0];
	}

	const sincePurchase =
		account.recentValuation.amount - account.originalPurchasePrice;

	const sincePurchasePercentage = (
		(sincePurchase / account.originalPurchasePrice) *
		100
	).toFixed(1);

	const nbrYrsSincePurchase = calDiffInYears(
		account.originalPurchasePriceDate,
		"yyyy-mm-dd"
	);

	const annualAppreciation = (
		sincePurchasePercentage / nbrYrsSincePurchase
	).toFixed(1);

	const formattedOriginalPurchasePriceDate = formatDate(
		new Date(account.originalPurchasePriceDate),
		"MMMM yyyy"
	);

	return (
		<Inset>
			<AccountSection>
				<AccountLabel>Estimated Value</AccountLabel>
				<AccountHeadline>
					{formatAmount(account.recentValuation.amount)}
				</AccountHeadline>
				<AccountList>
					<AccountListItem>
						<InfoText>
							{`Last updated ${formatDate(lastUpdate, "do MMM yyyy")}`}
						</InfoText>
					</AccountListItem>
					<AccountListItem>
						<InfoText>
							{`Next update ${format(
								add(lastUpdate, { days: account.updateAfterDays }),
								"do MMM yyyy"
							)}`}
						</InfoText>
					</AccountListItem>
				</AccountList>
			</AccountSection>
			<AccountSection>
				<AccountLabel>Property details</AccountLabel>
				<RowContainer>
					<AccountList>
						<AccountListItem>
							<InfoText>{account.name}</InfoText>
						</AccountListItem>
						<AccountListItem>
							<InfoText>{account.bankName}</InfoText>
						</AccountListItem>
						<AccountListItem>
							<InfoText>{account.postcode}</InfoText>
						</AccountListItem>
					</AccountList>
				</RowContainer>
			</AccountSection>
			<AccountSection>
				<AccountLabel>Valuation Change</AccountLabel>
				<RowContainer>
					<AccountList>
						<AccountListItem>
							<InfoText>
								{
									<>
										Purchased for{" "}
										<b>{formatAmount(account.originalPurchasePrice)}</b> in{" "}
										{formattedOriginalPurchasePriceDate}
									</>
								}
							</InfoText>
						</AccountListItem>
						<AccountListItem>
							<InfoText>Since purchase</InfoText>
							<InfoText>
								<Badge>{`${formatAmount(
									sincePurchase
								)} (${sincePurchasePercentage}%)`}</Badge>
							</InfoText>
						</AccountListItem>
						<AccountListItem>
							<InfoText>Annual appreciation</InfoText>
							<InfoText>
								<Badge>{`${annualAppreciation}%`}</Badge>
							</InfoText>
						</AccountListItem>
					</AccountList>
				</RowContainer>
			</AccountSection>
			{mortgage && (
				<AccountSection>
					<AccountLabel>Mortgage</AccountLabel>
					<RowContainer
						// This is a dummy action
						onClick={() => alert("You have navigated to the mortgage page")}>
						<AccountList>
							<AccountListItem>
								<InfoText>
									{formatAmount(
										Math.abs(account.associatedMortgages[0].currentBalance)
									)}
								</InfoText>
							</AccountListItem>
							<AccountListItem>
								<InfoText>{account.associatedMortgages[0].name}</InfoText>
							</AccountListItem>
						</AccountList>
					</RowContainer>
				</AccountSection>
			)}
			<Button
				// This is a dummy action
				onClick={() => alert("You have navigated to the edit account page")}>
				Edit account
			</Button>
		</Inset>
	);
};

export default Detail;
