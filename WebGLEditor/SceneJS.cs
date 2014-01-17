﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Windows.Forms;

namespace WebGLEditor
{
    public class SceneJS
    {
        TreeNode mTreeNode;
        int mRPIndex = 0;
        int mUPIndex = 0;
        int mROIndex = 0;
        int mVPIndex = 0;
        int mCamIndex = 0;
        int mFBIndex = 0;
        int mSIndex = 0;
        int mLIndex = 0;
        int mTIndex = 0;
        int mPartIndex = 0;
        int mPartEIndex = 0;
        int mPartSIndex = 0;

        public List<RenderObjectJS> mRenderObjects;
        public List<CameraJS> mCameras;
        public List<LightJS> mLights;
        
        public SceneJS(string json, TreeNode node)
        {
            mRenderObjects = new List<RenderObjectJS>();
            mCameras = new List<CameraJS>();
            mLights = new List<LightJS>();

            mTreeNode = node;

            TreeNode unode = AddChildNode("Update Passes", "New Update Pass", onNewUpdatePass);
            TreeNode rnode = AddChildNode("Render Passes", "New Render Pass", onNewRenderPass);
            TreeNode ronode = AddChildNode("Render Objects", "New Render Object", onNewRenderObject);
            TreeNode vpnode = AddChildNode("Viewports", "New Viewport", onNewViewport);
            TreeNode camnode = AddChildNode("Cameras", "New Camera", onNewCamera);
            TreeNode fbnode = AddChildNode("Frame Buffers", "New Frame Buffer", onNewFrameBuffer);
            TreeNode mnode = AddChildNode("Meshes", null, null);
            TreeNode snode = AddChildNode("Shaders", "New Shader", onNewShader);
            TreeNode lightnode = AddChildNode("Lights", "New Light", onNewLight);
            TreeNode texnode = AddChildNode("Textures", "New Texture", onNewTexture);
            TreeNode particleNode = AddChildNode("Particles", "New Particle", onNewParticle);
            TreeNode particleENode = AddChildNode("Particle Emitters", "New Emitter", onNewEmitter);
            TreeNode particleSNode = AddChildNode("Particle Systems", "New Particle System", onNewParticleSystem);

            if (json != null)
            {
                // WorldUpdate;ShadowPass,DiffusePass,2DOverlay
                string[] props = json.Split(';');
                string[] updatePasses = props[0].Split(',');
                string[] renderPasses = props[1].Split(',');
                string[] renderObjects = props[2].Split(',');
                string[] viewports = props[3].Split(',');
                string[] cameras = props[4].Split(',');
                string[] frameBuffers = props[5].Split(',');
                string[] meshes = props[6].Split(',');
                string[] shaders = props[7].Split(',');
                string[] lights = props[8].Split(',');
                string[] textures = props[9].Split(',');
                string[] particles = props[10].Split(',');
                string[] particleEmitters = props[11].Split(',');
                string[] particleSystems = props[12].Split(',');


                for (int i = 0; i < updatePasses.Length; i++)
                {
                    if (updatePasses[i].Length > 0)
                    {
                        TreeNode child = unode.Nodes.Add(updatePasses[i]);
                        UpdatePassJS updatePass = new UpdatePassJS(updatePasses[i], child);
                        child.Tag = updatePass;
                    }
                }

                for (int i = 0; i < renderPasses.Length; i++)
                {
                    if (renderPasses[i].Length > 0)
                    {
                        TreeNode child = rnode.Nodes.Add(renderPasses[i]);
                        RenderPassJS renderPass = new RenderPassJS(renderPasses[i], child);
                        child.Tag = renderPass;
                    }
                }

                for (int i = 0; i < renderObjects.Length; i++)
                {
                    if (renderObjects[i].Length > 0)
                    {
                        TreeNode child = ronode.Nodes.Add(renderObjects[i]);
                        RenderObjectJS ro = new RenderObjectJS(renderObjects[i], child);
                        mRenderObjects.Add(ro);
                        child.Tag = ro;
                    }
                }

                for (int i = 0; i < viewports.Length; i++)
                {
                    if (viewports[i].Length > 0)
                    {
                        TreeNode child = vpnode.Nodes.Add(viewports[i]);
                        ViewportJS vp = new ViewportJS(viewports[i], child);
                        child.Tag = vp;
                    }
                }

                for (int i = 0; i < cameras.Length; i++)
                {
                    if (cameras[i].Length > 0)
                    {
                        TreeNode child = camnode.Nodes.Add(cameras[i]);
                        CameraJS cam = new CameraJS(cameras[i], child);
                        mCameras.Add(cam);
                        child.Tag = cam;
                    }
                }

                for (int i = 0; i < frameBuffers.Length; i++)
                {
                    if (frameBuffers[i].Length > 0)
                    {
                        TreeNode child = fbnode.Nodes.Add(frameBuffers[i]);
                        FrameBufferJS fb = new FrameBufferJS(frameBuffers[i], child);
                        child.Tag = fb;
                    }
                }

                for (int i = 0; i < meshes.Length; i++)
                {
                    if (meshes[i].Length > 0)
                    {
                        TreeNode child = mnode.Nodes.Add(meshes[i]);
                    }
                }

                for (int i = 0; i < shaders.Length; i++)
                {
                    if (shaders[i].Length > 0)
                    {
                        TreeNode child = snode.Nodes.Add(shaders[i]);
                        ShaderJS s = new ShaderJS(shaders[i], child);
                        child.Tag = s;
                    }
                }

                for (int i = 0; i < lights.Length; i++)
                {
                    if (lights[i].Length > 0)
                    {
                        TreeNode child = lightnode.Nodes.Add(lights[i]);
                        LightJS s = new LightJS(lights[i], child);
                        child.Tag = s;
                        mLights.Add(s);
                    }
                }

                for (int i = 0; i < textures.Length; i++)
                {
                    if (textures[i].Length > 0)
                    {
                        TreeNode child = texnode.Nodes.Add(textures[i]);
                        TextureJS s = new TextureJS(textures[i], child);
                        child.Tag = s;
                    }
                }

                for (int i = 0; i < particles.Length; i++)
                {
                    if (particles[i].Length > 0)
                    {
                        TreeNode child = particleNode.Nodes.Add(particles[i]);
                        ParticleJS part = new ParticleJS(particles[i], child);
                        child.Tag = part;
                    }
                }

                for (int i = 0; i < particleEmitters.Length; i++)
                {
                    if (particleEmitters[i].Length > 0)
                    {
                        TreeNode child = particleENode.Nodes.Add(particleEmitters[i]);
                        ParticleEmitterJS part = new ParticleEmitterJS(particleEmitters[i], child);
                        child.Tag = part;
                    }
                }

                for (int i = 0; i < particleSystems.Length; i++)
                {
                    if (particleSystems[i].Length > 0)
                    {
                        TreeNode child = particleSNode.Nodes.Add(particleSystems[i]);
                        ParticleSystemJS part = new ParticleSystemJS(particleSystems[i], child);
                        child.Tag = part;
                    }
                }
            }
        }

        public void CreateDefault()
        {
            UpdatePassJS up = CreateUpdatePass();
            RenderPassJS rp = CreateRenderPass();
            ViewportJS vp = CreateViewport();
            CameraJS cam = CreateCamera();

            cam.Pos = "5, 1, 0";
            cam.Far = 1000;
            cam.Near = 0.1f;

            rp.Viewport = vp.Name;
            rp.Camera = cam.Name;
            rp.ClearColor = System.Drawing.Color.LightSlateGray;
            rp.ClearMode = RenderPassJS.eClearMode.ColorDepthStencil;
        }

        private TreeNode AddChildNode(string nodeName, string newTag, EventHandler newFunc)
        {
            TreeNode node = mTreeNode.Nodes.Add(nodeName);
            if (newTag != null)
            {
                node.ContextMenu = new ContextMenu();
                node.ContextMenu.MenuItems.Add(newTag, newFunc);
            }

            return node;
        }

        public void Import(string data)
        {
            int idx = data.IndexOf(':');
            string type = data.Substring(0, idx);

            int idx2 = data.IndexOf(';');
            string name = data.Substring(idx + 1, idx2 - (idx + 1));

            TreeNode node = null;
            object obj = null;
            switch (type)
            {
                case "mesh":
                    node = FindTreeNode("Meshes");
                    break;
                case "renderObject":
                    node = FindTreeNode("Render Objects");
                    RenderObjectJS ro = new RenderObjectJS(name, node);
                    ro.Source = "./" + name + ".xml";
                    mRenderObjects.Add(ro);
                    obj = ro;
                    break;
                default:
                    Console.WriteLine("Unhandled import data type: " + type);
                    break;
            }
            if (node != null)
            {
                if (IsUniqueName(node, name))
                {
                    // Child doesnt exist, add it now
                    TreeNode child = node.Nodes.Add(name);
                    child.Tag = obj;
                }
            }
        }

        private TreeNode FindTreeNode(string nodeText)
        {
            TreeNode theNode = null;
            foreach (TreeNode node in mTreeNode.Nodes)
            {
                if (node.Text == nodeText)
                {
                    theNode = node;
                    break;
                }
            }

            return theNode;
        }

        private bool IsUniqueName(TreeNode node, string name)
        {
            TreeNode child = null;
            foreach (TreeNode n in node.Nodes)
            {
                if (n.Text == name)
                {
                    child = n;
                    break;
                }
            }

            return (child == null);
        }

        private UpdatePassJS CreateUpdatePass()
        {
            TreeNode upnode = FindTreeNode("Update Passes");

            string name;
            do
            {
                name = "UpdatePass_" + mUPIndex++;
            } while (!IsUniqueName(upnode, name));

            TreeNode node = upnode.Nodes.Add(name);
            UpdatePassJS up = new UpdatePassJS(name, node);
            up.Source = "./" + name + ".xml";
            node.Tag = up;

            return up;
        }

        private RenderPassJS CreateRenderPass()
        {
            TreeNode rpnode = FindTreeNode("Render Passes");

            string name;
            do
            {
                name = "RenderPass_" + mRPIndex++;
            } while (!IsUniqueName(rpnode, name));

            TreeNode node = rpnode.Nodes.Add(name);
            RenderPassJS rp = new RenderPassJS(name, node);
            rp.Source = "./" + name + ".xml";
            node.Tag = rp;

            return rp;
        }

        private RenderObjectJS CreateRenderObject()
        {
            TreeNode ronode = FindTreeNode("Render Objects");

            string name;
            do
            {
                name = "RenderObject_" + mROIndex++;
            } while (!IsUniqueName(ronode, name));

            TreeNode node = ronode.Nodes.Add(name);
            RenderObjectJS obj = new RenderObjectJS(name, node);
            obj.Source = "./" + name + ".xml";
            mRenderObjects.Add(obj);
            node.Tag = obj;
            return obj;
        }

        private ViewportJS CreateViewport()
        {
            TreeNode pnode = FindTreeNode("Viewports");

            string name;
            do
            {
                name = "Viewport_" + mVPIndex++;
            } while (!IsUniqueName(pnode, name));

            TreeNode node = pnode.Nodes.Add(name);
            ViewportJS obj = new ViewportJS(name, node);
            obj.Source = "./" + name + ".xml";
            node.Tag = obj;
            return obj;
        }

        private CameraJS CreateCamera()
        {
            TreeNode pnode = FindTreeNode("Cameras");

            string name;
            do
            {
                name = "Camera_" + mCamIndex++;
            } while (!IsUniqueName(pnode, name));

            TreeNode node = pnode.Nodes.Add(name);
            CameraJS obj = new CameraJS(name, node);
            obj.Source = "./" + name + ".xml";
            node.Tag = obj;
            mCameras.Add(obj);

            return obj;
        }

        private FrameBufferJS CreateFrameBuffer()
        {
            TreeNode pnode = FindTreeNode("Frame Buffers");

            string name;
            do
            {
                name = "FrameBuffer_" + mFBIndex++;
            } while (!IsUniqueName(pnode, name));

            TreeNode node = pnode.Nodes.Add(name);
            FrameBufferJS obj = new FrameBufferJS(name, node);
            obj.Source = "./" + name + ".xml";
            node.Tag = obj;
            return obj;
        }

        private ShaderJS CreateShader()
        {
            TreeNode pnode = FindTreeNode("Shaders");

            string name;
            do
            {
                name = "Shader_" + mSIndex++;
            } while (!IsUniqueName(pnode, name));

            TreeNode node = pnode.Nodes.Add(name);
            ShaderJS obj = new ShaderJS(name, node);
            obj.Source = "./" + name + ".xml";
            node.Tag = obj;
            return obj;
        }

        private LightJS CreateLight()
        {
            TreeNode pnode = FindTreeNode("Lights");

            string name;
            do
            {
                name = "Light_" + mLIndex++;
            } while (!IsUniqueName(pnode, name));

            TreeNode node = pnode.Nodes.Add(name);
            LightJS obj = new LightJS(name, node);
            obj.Source = "./" + name + ".xml";
            node.Tag = obj;
            mLights.Add(obj);
            return obj;
        }

        private TextureJS CreateTexture()
        {
            TreeNode pnode = FindTreeNode("Textures");

            string name;
            do
            {
                name = "Texture_" + mTIndex++;
            } while (!IsUniqueName(pnode, name));

            TreeNode node = pnode.Nodes.Add(name);
            TextureJS obj = new TextureJS(name, node);
            obj.Source = "./" + name + ".xml";
            node.Tag = obj;
            return obj;
        }

        private ParticleJS CreateParticle()
        {
            TreeNode pnode = FindTreeNode("Particles");

            string name;
            do
            {
                name = "Particle_" + mPartIndex++;
            } while (!IsUniqueName(pnode, name));

            TreeNode node = pnode.Nodes.Add(name);
            ParticleJS obj = new ParticleJS(name, node);
            obj.Source = "./" + name + ".xml";
            node.Tag = obj;
            return obj;
        }

        private ParticleEmitterJS CreateEmitter()
        {
            TreeNode pnode = FindTreeNode("Particle Emitters");

            string name;
            do
            {
                name = "ParticleEmitter_" + mPartEIndex++;
            } while (!IsUniqueName(pnode, name));

            TreeNode node = pnode.Nodes.Add(name);
            ParticleEmitterJS obj = new ParticleEmitterJS(name, node);
            obj.Source = "./" + name + ".xml";
            node.Tag = obj;
            return obj;
        }

        private ParticleSystemJS CreateParticleSystem()
        {
            TreeNode pnode = FindTreeNode("Particle Systems");

            string name;
            do
            {
                name = "ParticleSystem_" + mPartSIndex++;
            } while (!IsUniqueName(pnode, name));

            TreeNode node = pnode.Nodes.Add(name);
            ParticleSystemJS obj = new ParticleSystemJS(name, node);
            obj.Source = "./" + name + ".xml";
            node.Tag = obj;
            return obj;
        }

        public void onNewUpdatePass(object sender, EventArgs e)
        {
            CreateUpdatePass();
        }

        public void onNewRenderPass(object sender, EventArgs e)
        {
            CreateRenderPass();
        }

        public void onNewRenderObject(object sender, EventArgs e)
        {
            CreateRenderObject();
        }

        public void onNewViewport(object sender, EventArgs e)
        {
            CreateViewport();
        }

        public void onNewCamera(object sender, EventArgs e)
        {
            CreateCamera();
        }

        public void onNewFrameBuffer(object sender, EventArgs e)
        {
            CreateFrameBuffer();
        }

        public void onNewShader(object sender, EventArgs e)
        {
            CreateShader();
        }

        public void onNewLight(object sender, EventArgs e)
        {
            CreateLight();
        }

        public void onNewTexture(object sender, EventArgs e)
        {
            CreateTexture();
        }

        public void onNewParticle(object sender, EventArgs e)
        {
            CreateParticle();
        }

        public void onNewEmitter(object sender, EventArgs e)
        {
            CreateEmitter();
        }

        public void onNewParticleSystem(object sender, EventArgs e)
        {
            CreateParticleSystem();
        }    

        public RenderObjectJS FindRenderObject(string name)
        {
            foreach (RenderObjectJS ro in mRenderObjects)
            {
                if (ro.Name == name)
                    return ro;
            }

            return null;
        }
        
    }
}
