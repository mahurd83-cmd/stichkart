
const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 3000;
app.use(cors());
app.use(express.json({ limit: "35mb" }));
app.use(express.urlencoded({ extended: true, limit: "35mb" }));

app.use(express.static(__dirname));


// =====================================================
// DATA FOLDER
// =====================================================

const dataDir = path.join(__dirname, "data");

if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
}


const usersFile = path.join(dataDir, "users.json");
const referencesFile = path.join(dataDir, "references.json");
const ordersFile = path.join(dataDir, "orders.json");
const tailorsFile = path.join(dataDir, "tailors.json");


function ensureFile(file, defaultData = []) {

    if (!fs.existsSync(file)) {
        fs.writeFileSync(
            file,
            JSON.stringify(defaultData, null, 2)
        );
    }
}


ensureFile(usersFile);
ensureFile(referencesFile);
ensureFile(ordersFile);


// =====================================================
// TAILOR DATA
// =====================================================

const defaultTailors = [

    {
        id: "TAILOR001",
        name: "Royal Stitch Studio",
        gender: "Men",
        specialization: "Sherwani • Suit • Kurta • Indo-Western",
        location: "Pratapgarh, Uttar Pradesh",
        experience: "12+ Years",
        rating: 4.9,
        reviews: 128,
        startingPrice: 799,
        phone: "9000000001",
        available: true
    },

    {
        id: "TAILOR002",
        name: "The Blouse Atelier",
        gender: "Women",
        specialization: "Designer Blouse • Bridal Blouse • Lehenga",
        location: "Lucknow, Uttar Pradesh",
        experience: "10+ Years",
        rating: 4.9,
        reviews: 214,
        startingPrice: 699,
        phone: "9000000002",
        available: true
    },

    {
        id: "TAILOR003",
        name: "Classic Couture",
        gender: "All",
        specialization: "Shirts • Dresses • Suits • Custom Wear",
        location: "Kanpur, Uttar Pradesh",
        experience: "8+ Years",
        rating: 4.8,
        reviews: 176,
        startingPrice: 599,
        phone: "9000000003",
        available: true
    },

    {
        id: "TAILOR004",
        name: "Kids Couture Studio",
        gender: "Kids",
        specialization: "Kids Dress • Frock • Kurta • Lehenga",
        location: "Prayagraj, Uttar Pradesh",
        experience: "7+ Years",
        rating: 4.8,
        reviews: 94,
        startingPrice: 499,
        phone: "9000000004",
        available: true
    },

    {
        id: "TAILOR005",
        name: "Perfect Fit Tailors",
        gender: "All",
        specialization: "Alteration • Custom Fit • Repair",
        location: "Fatehpur, Uttar Pradesh",
        experience: "15+ Years",
        rating: 4.9,
        reviews: 302,
        startingPrice: 299,
        phone: "9000000005",
        available: true
    }

];


ensureFile(tailorsFile, defaultTailors);


// =====================================================
// HELPERS
// =====================================================

function readJSON(file) {

    try {

        const data = fs.readFileSync(file, "utf8");

        return JSON.parse(data || "[]");

    } catch (error) {

        console.error("JSON read error:", error);

        return [];

    }

}


function saveJSON(file, data) {

    fs.writeFileSync(
        file,
        JSON.stringify(data, null, 2)
    );

}


function generateId(prefix = "") {

    return (
        prefix +
        Date.now().toString() +
        Math.random()
            .toString(36)
            .substring(2, 7)
    );

}


function generateOrderNumber() {

    return (
        "SK" +
        Date.now().toString().slice(-8)
    );

}


// =====================================================
// HOME
// =====================================================

app.get("/", (req, res) => {

    res.sendFile(
        path.join(__dirname, "index.html")
    );

});


// =====================================================
// STATUS
// =====================================================

app.get("/api/status", (req, res) => {

    res.json({

        success: true,

        message: "StichKart backend is running",

        time: new Date().toISOString()

    });

});


// =====================================================
// CATEGORIES
// =====================================================

const categories = {

    MEN: [
        "Shirt",
        "Formal Shirt",
        "Casual Shirt",
        "Kurta",
        "Kurta-Pajama",
        "Pajama",
        "Pathani Suit",
        "Trousers / Pants",
        "Formal Trouser",
        "Casual Pant",
        "Shorts",
        "Blazer",
        "Waistcoat",
        "Nehru Jacket",
        "Suit",
        "3-Piece Suit",
        "Sherwani",
        "Indo-Western",
        "Jodhpuri Suit",
        "Bandhgala",
        "Dhoti",
        "Dhoti-Kurta"
    ],

    WOMEN: [
        "Blouse",
        "Bridal Blouse",
        "Wedding Blouse",
        "Designer Blouse",
        "High-Neck Blouse",
        "Padded Blouse",
        "Kurti",
        "Straight Kurti",
        "A-Line Kurti",
        "Anarkali",
        "Salwar Suit",
        "Churidar",
        "Kameez",
        "Punjabi Suit",
        "Palazzo",
        "Sharara",
        "Gharara",
        "Lehenga",
        "Lehenga Choli",
        "Bridal Lehenga",
        "Gown",
        "Party Gown",
        "Evening Gown",
        "Top",
        "Peplum Top",
        "Skirt",
        "Petticoat",
        "Pant",
        "Formal Trousers",
        "Jumpsuit",
        "Kaftan",
        "Indo-Western Dress",
        "Co-ord Set"
    ],

    KIDS: [
        "Kids Shirt",
        "Kids T-Shirt",
        "Kids Kurta",
        "Kids Kurta-Pajama",
        "Kids Pajama",
        "Kids Trousers",
        "Kids Shorts",
        "Kids Blazer",
        "Kids Suit",
        "Kids Sherwani",
        "Kids Frock",
        "Kids Dress",
        "Kids Lehenga",
        "Kids Lehenga Choli",
        "Kids Blouse",
        "Kids Kurti",
        "Kids Salwar Suit",
        "Kids Gown",
        "Kids Skirt",
        "Kids Pant"
    ],

    SERVICES: [
        "Length Alteration",
        "Waist Alteration",
        "Sleeve Alteration",
        "Shoulder Alteration",
        "Size Adjustment",
        "Zip Replacement",
        "Button Replacement",
        "Hook / Eye Repair",
        "Pocket Repair",
        "Tear / Stitch Repair",
        "Blouse Alteration",
        "Pant Alteration",
        "Shirt Alteration",
        "Kurta Alteration",
        "Lehenga Alteration",
        "Dress Alteration"
    ]

};


app.get("/api/categories", (req, res) => {

    res.json({

        success: true,

        categories

    });

});


// =====================================================
// USERS
// =====================================================

app.get("/api/users", (req, res) => {

    const users = readJSON(usersFile);

    res.json({

        success: true,

        users

    });

});


app.post("/api/users", (req, res) => {

    const { name, phone } = req.body;

    if (!name || !phone) {

        return res.status(400).json({

            success: false,

            message: "Name and phone are required."

        });

    }


    const users = readJSON(usersFile);


    const existingUser = users.find(
        user => String(user.phone) === String(phone)
    );


    if (existingUser) {

        return res.json({

            success: true,

            user: existingUser,

            message: "User already exists."

        });

    }


    const user = {

        id: generateId("USER_"),

        name: String(name).trim(),

        phone: String(phone).trim(),

        createdAt: new Date().toISOString()

    };


    users.push(user);

    saveJSON(usersFile, users);


    res.json({

        success: true,

        user

    });

});


// =====================================================
// REFERENCES
// =====================================================

app.get("/api/references/:userId", (req, res) => {

    const references = readJSON(referencesFile);

    const userReferences = references.filter(
        ref =>
            String(ref.userId) ===
            String(req.params.userId)
    );


    res.json({

        success: true,

        references: userReferences

    });

});


app.post("/api/references", (req, res) => {

    const references = readJSON(referencesFile);

    const reference = {

        id: generateId("REF_"),

        ...req.body,

        createdAt: new Date().toISOString()

    };


    references.push(reference);

    saveJSON(referencesFile, references);


    res.json({

        success: true,

        reference

    });

});


// =====================================================
// TAILORS
// =====================================================

app.get("/api/tailors", (req, res) => {

    const tailors = readJSON(tailorsFile);

    const availableTailors =
        tailors.filter(
            tailor => tailor.available !== false
        );


    res.json({

        success: true,

        tailors: availableTailors

    });

});


// =====================================================
// SINGLE TAILOR
// =====================================================

app.get("/api/tailors/:id", (req, res) => {

    const tailors = readJSON(tailorsFile);

    const tailor = tailors.find(
        item =>
            String(item.id) ===
            String(req.params.id)
    );


    if (!tailor) {

        return res.status(404).json({

            success: false,

            message: "Tailor not found."

        });

    }


    res.json({

        success: true,

        tailor

    });

});


// =====================================================
// ORDERS
// =====================================================

app.get("/api/orders", (req, res) => {

    let orders = readJSON(ordersFile);


    /*
     * Optional customer filtering
     */

    if (req.query.userId) {

        orders = orders.filter(
            order =>
                String(order.userId) ===
                String(req.query.userId)
        );

    }


    /*
     * Optional tailor filtering
     */

    if (req.query.tailorId) {

        orders = orders.filter(
            order =>
                String(order.tailorId) ===
                String(req.query.tailorId)
        );

    }


    res.json({

        success: true,

        orders

    });

});


// =====================================================
// CREATE ORDER
// =====================================================

app.post("/api/orders", (req, res) => {

    const {

        customerName,

        phone,

        userId,

        gender,

        garment,

        designReference,

        physicalReferenceGarment,

        instructions,

        tailorId

    } = req.body;


    if (
        !customerName ||
        !phone ||
        !gender ||
        !garment
    ) {

        return res.status(400).json({

            success: false,

            message:
                "Customer name, phone, collection and garment are required."

        });

    }


    const orders = readJSON(ordersFile);

    const tailors = readJSON(tailorsFile);


    let selectedTailor = null;


    if (tailorId) {

        selectedTailor =
            tailors.find(
                tailor =>
                    String(tailor.id) ===
                    String(tailorId)
            );


        if (!selectedTailor) {

            return res.status(400).json({

                success: false,

                message: "Selected tailor not found."

            });

        }

    }


    const order = {

        id: generateId("ORDER_"),

        orderNumber: generateOrderNumber(),

        customerName: String(customerName).trim(),

        phone: String(phone).trim(),

        userId: userId || null,

        gender: String(gender),

        garment: String(garment),

        designReference: designReference || {

            url: "",

            fileName: "",

            fileType: "",

            fileData: ""

        },

        physicalReferenceGarment:
            Boolean(physicalReferenceGarment),

        instructions:
            instructions || "",

        tailorId:
            selectedTailor
                ? selectedTailor.id
                : null,

        tailorName:
            selectedTailor
                ? selectedTailor.name
                : "",

        tailorLocation:
            selectedTailor
                ? selectedTailor.location
                : "",

        status: "Reference Pending",

        createdAt: new Date().toISOString()

    };


    orders.push(order);

    saveJSON(ordersFile, orders);


    res.json({

        success: true,

        order

    });

});


// =====================================================
// ASSIGN / CHANGE TAILOR
// =====================================================

app.patch("/api/orders/:id/tailor", (req, res) => {

    const { tailorId } = req.body;

    const orders = readJSON(ordersFile);

    const tailors = readJSON(tailorsFile);


    const orderIndex =
        orders.findIndex(
            order =>
                String(order.id) ===
                String(req.params.id)
        );


    if (orderIndex === -1) {

        return res.status(404).json({

            success: false,

            message: "Order not found."

        });

    }


    const tailor =
        tailors.find(
            item =>
                String(item.id) ===
                String(tailorId)
        );


    if (!tailor) {

        return res.status(404).json({

            success: false,

            message: "Tailor not found."

        });

    }


    orders[orderIndex].tailorId =
        tailor.id;

    orders[orderIndex].tailorName =
        tailor.name;

    orders[orderIndex].tailorLocation =
        tailor.location;


    saveJSON(ordersFile, orders);


    res.json({

        success: true,

        order: orders[orderIndex]

    });

});


// =====================================================
// UPDATE ORDER STATUS
// =====================================================

app.patch("/api/orders/:id/status", (req, res) => {

    const { status } = req.body;

    const orders = readJSON(ordersFile);


    const index =
        orders.findIndex(
            order =>
                String(order.id) ===
                String(req.params.id)
        );


    if (index === -1) {

        return res.status(404).json({

            success: false,

            message: "Order not found."

        });

    }


    orders[index].status = status;

    orders[index].updatedAt =
        new Date().toISOString();


    saveJSON(ordersFile, orders);


    res.json({

        success: true,

        order: orders[index]

    });

});


// =====================================================
// 404
// =====================================================

app.use((req, res) => {

    res.status(404).json({

        success: false,

        message: "Route not found"

    });

});


// =====================================================
// START SERVER
// =====================================================

app.listen(PORT, () => {

    console.log("");
    console.log("====================================");
    console.log("       STICHKART BACKEND");
    console.log("====================================");
    console.log(`Website : http://localhost:${PORT}`);
    console.log(`API     : http://localhost:${PORT}/api/status`);
    console.log("Server is running...");
    console.log("====================================");
    console.log("");

});