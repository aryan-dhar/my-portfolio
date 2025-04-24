const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const app = express();

// Replace with your desired admin password
const ADMIN_PASSWORD = 'your-secure-password';

// Connect to MongoDB
mongoose.connect('mongodb://localhost/portfolio', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// Project Schema
const ProjectSchema = new mongoose.Schema({
    title: String,
    description: String,
    link: String,
    imageUrl: String,
    createdAt: { type: Date, default: Date.now },
});

const Project = mongoose.model('Project', ProjectSchema);

app.use(express.json());
app.use(express.static('.')); // Serve static files

// Admin login
app.post('/api/admin/login', (req, res) => {
    if (req.body.password === ADMIN_PASSWORD) {
        res.status(200).json({ success: true });
    } else {
        res.status(401).json({ success: false });
    }
});

// Get all projects
app.get('/api/projects', async (req, res) => {
    try {
        const projects = await Project.find().sort('-createdAt');
        res.json(projects);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch projects' });
    }
});

// Add new project
app.post('/api/projects', async (req, res) => {
    try {
        const project = new Project(req.body);
        await project.save();
        res.status(201).json(project);
    } catch (error) {
        res.status(500).json({ error: 'Failed to add project' });
    }
});

// Delete project
app.delete('/api/projects/:id', async (req, res) => {
    try {
        await Project.findByIdAndDelete(req.params.id);
        res.status(200).json({ success: true });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete project' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
}); 