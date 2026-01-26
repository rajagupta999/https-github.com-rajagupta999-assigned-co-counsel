
export const mockCases = [
    {
        id: "CASE-2025-001",
        client: "John Doe",
        charges: "Felony Burglary",
        county: "New York County",
        status: "Open",
        nextCourtDate: "2025-11-15",
    },
    {
        id: "CASE-2025-002",
        client: "Jane Smith",
        charges: "Misdemeanor Assault",
        county: "Bronx County",
        status: "Open",
        nextCourtDate: "2025-10-30",
    },
    {
        id: "CASE-2025-003",
        client: "Robert Brown",
        charges: "Family Offense",
        county: "Nassau County",
        status: "Review",
        nextCourtDate: "2025-12-01",
    }
];

export const mockTasks = [
    { id: 1, title: "File Notice of Appearance", caseId: "CASE-2025-001", due: "Tomorrow", urgent: true },
    { id: 2, title: "Submit Voucher #442", caseId: "CASE-2025-002", due: "3 days", urgent: false },
    { id: 3, title: "Review Discovery", caseId: "CASE-2025-003", due: "Next Week", urgent: false },
];

export const mockStats = {
    pendingVouchers: "$4,250.00",
    billableHoursThisMonth: 34.5,
    pslfProgress: 82, // Percent
};
