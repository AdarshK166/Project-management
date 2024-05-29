const { Project, User, AuditLog } = require("../models");
const { cacheResponse } = require("../middlewares/cache");

exports.createProject = [
  async (req, res, next) => {
    try {
      const { name, description, status, project_manager_id, client_id } = req.body;
      const project = await Project.create({
        name,
        description,
        status,
        project_manager_id,
        client_id,
      });
      req.project = project;
      next();
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  logAction("create", "Project", (req) => req.project.id),
];

exports.updateProject = [
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const { name, description, status, project_manager_id, client_id } = req.body;
      const project = await Project.findByPk(id);
      if (!project) {
        return res.status(404).json({ error: "Project not found" });
      }
      project.name = name;
      project.description = description;
      project.status = status;
      project.project_manager_id = project_manager_id;
      project.client_id = client_id;
      await project.save();
      req.project = project;
      next();
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  logAction("update", "Project", (req) => req.project.id),
];

exports.deleteProject = [
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const project = await Project.findByPk(id);
      if (!project) {
        return res.status(404).json({ error: "Project not found" });
      }
      await project.destroy();
      req.project = project;
      next();
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  logAction("delete", "Project", (req) => req.project.id),
];

exports.getProjects = async (req, res) => {
  const { page = 1, limit = 10, sort = "createdAt", order = "ASC" } = req.query;
  const key = `projects:${page}:${limit}:${sort}:${order}`;
  try {
    const offset = (page - 1) * limit;
    const projects = await Project.findAndCountAll({
      offset,
      limit: parseInt(limit),
      order: [[sort, order.toUpperCase()]],
    });
    const response = {
      total: projects.count,
      pages: Math.ceil(projects.count / limit),
      data: projects.rows,
    };
    cacheResponse(key, response);
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getProjectById = async (req, res) => {
  const { id } = req.params;
  try {
    const project = await Project.findByPk(id);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }
    res.status(200).json(project);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
