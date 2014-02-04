using System;
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
        int mMeshIndex = 0;
        int mSIndex = 0;
        int mLIndex = 0;
        int mTIndex = 0;
        int mPartIndex = 0;
        int mPartEIndex = 0;
        int mPartSIndex = 0;

        string mScenePath;

        public List<RenderObjectJS> mRenderObjects;
        public List<CameraJS> mCameras;
        public List<LightJS> mLights;

        public string mFilename = null;
        
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
            TreeNode mnode = AddChildNode("Meshes", "New Mesh", onNewMesh);
            TreeNode snode = AddChildNode("Shaders", "New Shader", onNewShader);
            TreeNode lightnode = AddChildNode("Lights", "New Light", onNewLight);
            TreeNode texnode = AddChildNode("Textures", "New Texture", onNewTexture);
            TreeNode particleNode = AddChildNode("Particles", "New Particle", onNewParticle);
            TreeNode particleENode = AddChildNode("Particle Emitters", "New Emitter", onNewEmitter);
            TreeNode particleSNode = AddChildNode("Particle Systems", "New Particle System", onNewParticleSystem);

            texnode.ContextMenu.MenuItems.Add("Import", onImportTextures);

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
                mScenePath = props[13];


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

        public void CreateCopy(object obj)
        {
            Type t = obj.GetType();
            switch (t.ToString())
            {
                case "WebGLEditor.RenderObjectJS":
                    RenderObjectJS ro = (RenderObjectJS)obj;
                    RenderObjectJS newro = CreateRenderObject(ro.Name);
                    newro.CopyFrom(ro);

                    // Add to all appropriate update passes
                    TreeNode passes = FindTreeNode("Update Passes");
                    foreach( TreeNode pass in passes.Nodes )
                    {
                        if( FindTreeNode(ro.Name, FindTreeNode("Render Objects", pass)) != null )
                        {
                            UpdatePassJS up = (UpdatePassJS)pass.Tag;
                            up.AddRenderObject(newro.Name);
                        }
                    }
                    
                    // Add to all appropriate render passes
                    passes = FindTreeNode("Render Passes");
                    foreach( TreeNode pass in passes.Nodes )
                    {
                        if( FindTreeNode(ro.Name, FindTreeNode("Render Objects", pass)) != null )
                        {
                            RenderPassJS rp = (RenderPassJS)pass.Tag;
                            rp.AddRenderObject(newro.Name);
                        }
                    }
                    break;
                default:
                    break;
            }

            /*
            UpdatePassJS up = (UpdatePassJS)obj;
            RenderPassJS rp = (RenderPassJS)obj;
            RenderObjectJS ro = (RenderObjectJS)obj;
            ViewportJS vp = (ViewportJS)obj;
            CameraJS cam = (CameraJS)obj;
            FrameBufferJS fb = (FrameBufferJS)obj;
            MeshJS mesh = (MeshJS)obj;
            ShaderJS sh = (ShaderJS)obj;
            LightJS light = (LightJS)obj;
            TextureJS tex = (TextureJS)obj;
            ParticleJS part = (ParticleJS)obj;
            ParticleEmitterJS pe = (ParticleEmitterJS)obj;
            ParticleSystemJS ps = (ParticleSystemJS)obj;
            */
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
                    ro.Source = name + ".xml";
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

        private TreeNode FindTreeNode(string nodeText, TreeNode parent = null)
        {
            if (parent == null)
                parent = mTreeNode;
            TreeNode theNode = null;
            foreach (TreeNode node in parent.Nodes)
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
            up.Source = name + ".xml";
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
            rp.Source = name + ".xml";
            node.Tag = rp;

            return rp;
        }

        private RenderObjectJS CreateRenderObject(string inname = null)
        {
            TreeNode ronode = FindTreeNode("Render Objects");

            string name;
            int idx = 0;
            do
            {
                if (inname == null)
                    name = "RenderObject_" + mROIndex++;
                else
                    name = inname + "_" + idx++;
            } while (!IsUniqueName(ronode, name));

            TreeNode node = ronode.Nodes.Add(name);
            RenderObjectJS obj = new RenderObjectJS(name, node);
            obj.Source = name + ".xml";
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
            obj.Source = name + ".xml";
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
            obj.Source = name + ".xml";
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
            obj.Source = name + ".xml";
            node.Tag = obj;
            return obj;
        }

        private MeshJS CreateMesh()
        {
            TreeNode pnode = FindTreeNode("Meshes");

            string name;
            do
            {
                name = "Mesh_" + mMeshIndex++;
            } while (!IsUniqueName(pnode, name));

            TreeNode node = pnode.Nodes.Add(name);
            MeshJS obj = new MeshJS(name, node);
            obj.Source = name + ".xml";
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
            obj.Source = name + ".xml";
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
            obj.Source = name + ".xml";
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
            obj.Source = name + ".xml";
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
            obj.Source = name + ".xml";
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
            obj.Source = name + ".xml";
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
            obj.Source = name + ".xml";
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

        public void onNewMesh(object sender, EventArgs e)
        {
            CreateMesh();
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

        public void onImportTextures(object sender, EventArgs e)
        {
            OpenFileDialog dlg = new OpenFileDialog();
            dlg.Multiselect = true;
            if (dlg.ShowDialog() != DialogResult.Cancel)
            {
                TreeNode pnode = FindTreeNode("Textures");

                foreach (string filename in dlg.FileNames)
                {
                    string relative = NativeWrapper.GetRelative(filename);
                    int lastSlash = relative.LastIndexOf('/');
                    string imagePath = relative.Substring(0, lastSlash + 1);
                    string imageName = relative.Substring(lastSlash + 1);

                    if (imagePath.Substring(0, mScenePath.Length) == mScenePath)
                        imagePath = imagePath.Substring(mScenePath.Length);

                    string texName = imageName;
                    int idx = 0;
                    while (!IsUniqueName(pnode, texName))
                    {
                        texName = filename + "_" + idx++;
                    }

                    TreeNode node = pnode.Nodes.Add(texName);
                    TextureJS obj = new TextureJS(texName, node);
                    obj.Source = imagePath + imageName;
                    node.Tag = obj;
                }
            }
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

        public object FindObject(string type, string name)
        {
            object obj = null;
            TreeNode node = null;
            switch (type)
            {
                case "updatePass":
                    node = FindTreeNode("Update Passes");
                    break;
                case "renderPass":
                    node = FindTreeNode("Render Passes");
                    break;
                case "renderObject":
                    node = FindTreeNode("Render Objects");
                    break;
                case "viewport":
                    node = FindTreeNode("Viewports");
                    break;
                case "camera":
                    node = FindTreeNode("Cameras");
                    break;
                case "frameBuffer":
                    node = FindTreeNode("Frame Buffers");
                    break;
                case "mesh":
                    node = FindTreeNode("Meshes");
                    break;
                case "shader":
                    node = FindTreeNode("Shaders");
                    break;
                case "light":
                    node = FindTreeNode("Lights");
                    break;
                case "texture":
                    node = FindTreeNode("Textures");
                    break;
                case "particle":
                    node = FindTreeNode("Particles");
                    break;
                case "particleEmitter":
                    node = FindTreeNode("Particle Emitters");
                    break;
                case "particleSystem":
                    node = FindTreeNode("Particle Systems");
                    break;
                default:
                    break;
            }

            if (node != null)
            {
                foreach (TreeNode child in node.Nodes)
                {
                    if (child.Text == name)
                    {
                        obj = child.Tag;
                        break;
                    }
                }
            }

            return obj;
        }

        public object GetSelectedObject()
        {
            object obj = null;

            string[] objdata = NativeWrapper.GetSelectedObject().Split(';');
            if( objdata.Length > 0 )
            {
                string[] names = objdata[0].Split(':');                
                if (names.Length > 0)
                {
                    obj = FindObject(names[0], names[1]);                    
                }
            }

            return obj;
        }

        public void BuildWall()
        {
            TreeNode rpnode = FindTreeNode("Render Passes").Nodes[0];
            RenderPassJS rp = (RenderPassJS)rpnode.Tag;

            for( int y = 0; y < 8; y++ )
            {
                for (int x = 0; x < 8; x++)
                {
                    RenderObjectJS js = CreateRenderObject();
                    js.Name = "wall_f_" + (y + 1) + "_" + (x + 1);
                    js.Source = "walls/" + js.Name + ".xml";
                    js.Texture = "f_" + (y + 1) + "_" + (x + 1) + ".jpg";
                    js.Position.X = 400 - (x * 100);
                    js.Position.Y = 300 - (y * 100);
                    js.Position.Z = 400;
                    js.Rotation.Y = 180;
                    js.Mesh = "quad";
                    js.Shader = "Shader_0";
                    js.Scale.X = 100;
                    js.Scale.Y = 100;

                    rp.AddRenderObject(js.Name);
                }
            }
        }
        
    }
}
