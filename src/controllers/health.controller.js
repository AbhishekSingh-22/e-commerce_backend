export const health = async (req, res) => {
    try {
        return res.status(200).json({ message: "Service up and running.", status: "UP"});
    } catch (err) {
        console.error('Error: ', err.message);
        return res.status(500).json({ message: 'Internal server error.', error: err.message });
    }
}