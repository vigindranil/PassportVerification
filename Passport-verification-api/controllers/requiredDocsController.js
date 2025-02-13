// Function to determine required documents based on citizen type and date of birth
function getRequiredDocuments(citizenTypeId, dateOfBirth) {
    const dob = new Date(dateOfBirth);
    if (isNaN(dob.getTime())) {
        return { error: "Invalid date format. Please use YYYY-MM-DD." };
    }

    const requiredDocuments = {
        1: [],
        2: [
            "Certificate of Naturalization",
            "Indian Passport",
            "Government-issued Identity Proof",
            "Address Proof",
            "Nationality Proof"
        ],
        3: [
            "Certificate of Registration",
            "Indian Passport",
            "Birth Certificate",
            "Government-issued Identity Proof",
            "Address Proof",
            "Nationality Proof"
        ],
        4: [
            "Proof of Descent",
            "Birth Certificate",
            "Parent’s Citizenship Proof (Passport, Voter ID, Birth Certificate, Land Deed, School Certificate)",
            "Indian Passport",
            "Nationality Proof"
        ]
    };

    if (citizenTypeId === 1) {
        if (dob >= new Date("1950-01-26") && dob < new Date("1987-07-01")) {
            requiredDocuments[1] = [
                "Previously held Indian Passport",
                "Birth Certificate",
                "Voter ID card",
                "One parent's Voter ID card or Death Certificate",
                "Education Documents",
                "Aadhar Card",
                "Electric Bill",
                "Land deed"
            ];
        } else if (dob >= new Date("1987-07-01") && dob < new Date("2004-12-03")) {
            requiredDocuments[1] = [
                "Previously held Indian Passport",
                "Birth Certificate",
                "Proof that one parent was an Indian citizen (Voter ID / Birth Certificate / Death Certificate / Land Deed / Passport / School Certificate)"
            ];
        } else if (dob >= new Date("2004-12-03")) {
            requiredDocuments[1] = [
                "Previously held Indian Passport",
                "Birth Certificate",
                "Proof that both parents were Indian citizens OR one parent was an Indian citizen and the other was not an illegal migrant (Voter ID / Birth Certificate / Death Certificate / Land Deed / Passport / School Certificate / Migrant Certificate)"
            ];
        } else {
            return { status: 1, message: "Invalid date of birth range for citizen by birth.", data: []};
        }
    }

    if (!requiredDocuments[citizenTypeId]) {
        return { status: 1, message: "Invalid citizen type ID", data: []};
    }

    return requiredDocuments[citizenTypeId];
}

export const requiredDocuments = async (req, res) => {
    const { citizenTypeId, dateOfBirth } = req.body;

    if (!citizenTypeId || !dateOfBirth) {
        return res.status(400).json({status: 1, message: "Citizen Type and Date of Birth are required", data: [] });
    }

    const response = getRequiredDocuments(citizenTypeId, dateOfBirth);
    res.status(200).json({status: 0, message: 'Required documents fetched', data: response});
};