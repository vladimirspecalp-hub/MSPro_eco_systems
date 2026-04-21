import { Router } from "express";
import { generateSitemapXml } from "../services/sitemap-service";

const router = Router();

router.get("/sitemap.xml", async (_req, res) => {
    try {
        const xml = await generateSitemapXml();
        res.type("application/xml").send(xml);
    } catch (error: any) {
        console.error("Sitemap generation error:", error);
        res.status(500).send("Error generating sitemap");
    }
});

export default router;
