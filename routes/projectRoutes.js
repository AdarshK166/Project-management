const express = require("express");
const projectController = require("../controllers/projectController");
const authorization = require("../middlewares/authorization");
const validateProject = require("../validators/projectValidator");
const { cache } = require("../middlewares/cache");
const router = express.Router();

router.post("/", authorization(["SuperAdmin", "Admin"]), validateProject, projectController.createProject);
router.put("/:id", authorization(["SuperAdmin", "Admin"]), validateProject, projectController.updateProject);
router.delete("/:id", authorization(["SuperAdmin"]), projectController.deleteProject);
router.get("/", authorization(["SuperAdmin", "Admin", "Client"]), cache, projectController.getProjects);
router.get("/:id", authorization(["SuperAdmin", "Admin", "Client"]), projectController.getProjectById);

module.exports = router;
