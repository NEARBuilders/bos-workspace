const donations = Near.view("donate.potlock.near", "get_donations");

// Create an object to store aggregated donations by donor ID
const donorDonations = {};

// Iterate through the donations to aggregate donations
for (const donation of donations) {
  const { donor_id, total_amount } = donation;
  const donationAmount = parseFloat(total_amount);

  if (!donorDonations[donor_id]) {
    donorDonations[donor_id] = 0;
  }

  donorDonations[donor_id] += donationAmount;
}

// Convert the aggregated donations into an array of objects
const donorList = Object.keys(donorDonations).map((donor_id) => ({
  donor_id,
  total_amount: parseFloat(donorDonations[donor_id]).toFixed(0),
}));

// Sort the donorList by total donation amount in descending order
donorList.sort(
  (a, b) => parseFloat(b.total_amount) - parseFloat(a.total_amount)
);

return (
  <>
    <div className="d-flex justify-content-between m-3">
      <h3 className="m-1">🍲 PotLock 🔒</h3>
      <Widget
        src="mob.near/widget/Profile.ShortInlineBlock"
        props={{
          accountId: "potlock.near",
          tooltip: true,
        }}
      />{" "}
    </div>
    <div className="m-3">
      <h5>Generous Donors</h5>
      {donorList.map((donation, index) => (
        <>
          <hr />

          <div key={index} className="d-flex flex-row justify-content-between">
            <div className="m-2">
              <Widget
                src="mob.near/widget/Profile.ShortInlineBlock"
                props={{
                  accountId: `${donation.donor_id}`,
                  tooltip: true,
                }}
              />
            </div>
            <div className="m-1">
              <p>
                <b>
                  {(donation.total_amount / 1000000000000000000000000).toFixed(
                    0
                  )}
                </b>
                NEAR
              </p>
            </div>
          </div>
        </>
      ))}{" "}
    </div>
  </>
);
