# ShopYangu Admin Panel

Welcome to **ShopYangu Admin Panel**, a comprehensive and intuitive interface for managing shops and products on the ShopYangu platform. This admin panel allows efficient handling of shops and products, with real-time updates and insightful data visualizations to track platform performance.

### Live Demo

🔗 **Live Link**: [ShopYangu Admin Panel](https://shopyangu-ten.vercel.app)

---

## Features

### Shop Management

- **Create New Shop**: Easily add shops with details like Shop Name, Description, and Logo.
- **Update Shop Details**: Edit shop information such as Name, Description, and Logo.
- **Delete Shop**: Safely delete shops without active products. If a shop contains products, receive a warning to reassign or remove those products first.
- **View Shop List**: Access a list of all shops, displaying Name, Description, and Logo, with options to update or delete.

### Product Management

- **Create New Product**: Add products to shops with attributes like Name, Price, Stock Level, Description, and Image.
- **Update Product Details**: Modify product details, such as Price, Stock Level, and Description.
- **Delete Product**: Remove products from shops with ease.
- **View Product List**: Browse products in a sortable, searchable, and paginated list.

### Dashboard

- **Overview Metrics**:
  - Total Number of Shops.
  - Total Number of Products.
  - Total Value of Products in Shops (calculated using prices and stock levels).
  - Total Stock Level (sum of all product stock levels).
- **Stock Status**:
  - Visualize stock distribution:
    - **In Stock**: Products with stock levels greater than 5.
    - **Low Stock**: Products with stock levels between 1 and 5.
    - **Out of Stock**: Products with stock level 0.
  - View Top 5 Shops by Stock Level.
- **Real-Time Updates**: Metrics and dashboards update dynamically as changes occur in the platform.

### Search, Filter, and Pagination

- **Search Products**: Quickly find products by name.
- **Filter Products**: Refine product lists by Price, Stock Level, or Shop.
- **Pagination**: Navigate through large datasets effortlessly.

### Additional Features

- **Responsive Design**: Optimized for desktop and mobile devices.
- **Intuitive Interface**: Simple and user-friendly navigation with clear data presentation.

---

## Technical Details

### Frontend

- **Framework**: Built using [Next.js](https://nextjs.org/) for optimal performance and flexibility.

### Database

- **MongoDB**: Used to store and manage data for shops and products, ensuring scalability and reliability.

### Form Validation

- **Formik** and **Yup**: Implemented for robust and user-friendly form validation, ensuring data integrity before submission.

---

## Getting Started

### Prerequisites

- Node.js installed on your local machine.
- MongoDB instance or connection string for the database.

### Setup Instructions

1. **Clone the repository**:
   ```bash
   git clone https://github.com/DennisRono/shop-yangu.git
   ```
2. **Navigate to the project directory**:
   ```bash
   cd shop-yangu
   ```
3. **Install dependencies**:
   ```bash
   npm install
   ```
4. **Set up environment variables**:

   - Create a `.env.local` file in the root directory.
   - Add the following variables:

     ```plaintext
        # backend
        NEXT_PUBLIC_BACKEND_URL=""

        # database
        DATABASE_URL=""

        # cloudinary
        CLOUDINARY_CLOUD_NAME=""
        CLOUDINARY_API_KEY=""
        CLOUDINARY_API_SECRET=""
        NEXT_PUBLIC_UPLOAD_PRESET=""
     ```

   - Add the actual values to the variables

5. **Start the development server**:
   ```bash
   npm run dev
   ```
6. **Access the app**:
   - Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Testing Instructions

1. **Shop Management**:
   - Add, update, and delete shops. Attempt to delete a shop with products to confirm warnings.
2. **Product Management**:
   - Add, update, and delete products. Ensure changes reflect in real time.
3. **Search, Filter, and Pagination**:
   - Test product search and filtering functionality.
   - Confirm pagination works with larger datasets.
4. **Dashboard**:
   - Verify that metrics and graphs update dynamically with changes.

---

## Deployment

The application is deployed on **Vercel** for seamless live hosting.

### Deploy Your Own Instance

1. Push your code to a GitHub repository.
2. Link the repository to [Vercel](https://vercel.com/).
3. Set up environment variables (e.g., `DATABASE_URL`) in Vercel.
4. Deploy the application directly from Vercel.

---

## Contact

- **Author**: Dennis Kibet
- **Email**: [dennisrkibet@gmail.com](mailto:dennisrkibet@gmail.com)
- **Portfolio**: [denniskibet.com](https://denniskibet.com)

---

## License

This project is open-source and available under the [MIT License](LICENSE).

---

## Acknowledgements

- Thanks to [Next.js](https://nextjs.org/), [Formik](https://formik.org/), [Yup](https://github.com/jquense/yup), and [MongoDB](https://www.mongodb.com/) for their powerful tools and resources.
- Graphs and visualizations were inspired by best practices in modern admin panel design.
