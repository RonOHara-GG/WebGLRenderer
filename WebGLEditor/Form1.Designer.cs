namespace WebGLEditor
{
    partial class Form1
    {
        /// <summary>
        /// Required designer variable.
        /// </summary>
        private System.ComponentModel.IContainer components = null;

        /// <summary>
        /// Clean up any resources being used.
        /// </summary>
        /// <param name="disposing">true if managed resources should be disposed; otherwise, false.</param>
        protected override void Dispose(bool disposing)
        {
            if (disposing && (components != null))
            {
                components.Dispose();
            }
            base.Dispose(disposing);
        }

        #region Windows Form Designer generated code

        /// <summary>
        /// Required method for Designer support - do not modify
        /// the contents of this method with the code editor.
        /// </summary>
        private void InitializeComponent()
        {
            this.propertyGrid1 = new System.Windows.Forms.PropertyGrid();
            this.treeView1 = new System.Windows.Forms.TreeView();
            this.menuStrip1 = new System.Windows.Forms.MenuStrip();
            this.sceneToolStripMenuItem = new System.Windows.Forms.ToolStripMenuItem();
            this.openSceneToolStripMenuItem = new System.Windows.Forms.ToolStripMenuItem();
            this.nativeControl1 = new WebGLEditor.NativeControl();
            this.colladaToolStripMenuItem = new System.Windows.Forms.ToolStripMenuItem();
            this.ripColladaFileToolStripMenuItem = new System.Windows.Forms.ToolStripMenuItem();
            this.menuStrip1.SuspendLayout();
            this.SuspendLayout();
            // 
            // propertyGrid1
            // 
            this.propertyGrid1.Location = new System.Drawing.Point(1042, 319);
            this.propertyGrid1.Name = "propertyGrid1";
            this.propertyGrid1.Size = new System.Drawing.Size(311, 461);
            this.propertyGrid1.TabIndex = 1;
            // 
            // treeView1
            // 
            this.treeView1.Location = new System.Drawing.Point(1042, 12);
            this.treeView1.Name = "treeView1";
            this.treeView1.Size = new System.Drawing.Size(311, 301);
            this.treeView1.TabIndex = 2;
            // 
            // menuStrip1
            // 
            this.menuStrip1.Items.AddRange(new System.Windows.Forms.ToolStripItem[] {
            this.sceneToolStripMenuItem,
            this.colladaToolStripMenuItem});
            this.menuStrip1.Location = new System.Drawing.Point(0, 0);
            this.menuStrip1.Name = "menuStrip1";
            this.menuStrip1.Size = new System.Drawing.Size(1365, 24);
            this.menuStrip1.TabIndex = 3;
            this.menuStrip1.Text = "menuStrip1";
            // 
            // sceneToolStripMenuItem
            // 
            this.sceneToolStripMenuItem.DropDownItems.AddRange(new System.Windows.Forms.ToolStripItem[] {
            this.openSceneToolStripMenuItem});
            this.sceneToolStripMenuItem.Name = "sceneToolStripMenuItem";
            this.sceneToolStripMenuItem.Size = new System.Drawing.Size(50, 20);
            this.sceneToolStripMenuItem.Text = "Scene";
            // 
            // openSceneToolStripMenuItem
            // 
            this.openSceneToolStripMenuItem.Name = "openSceneToolStripMenuItem";
            this.openSceneToolStripMenuItem.Size = new System.Drawing.Size(152, 22);
            this.openSceneToolStripMenuItem.Text = "Open Scene";
            this.openSceneToolStripMenuItem.Click += new System.EventHandler(this.openSceneToolStripMenuItem_Click);
            // 
            // nativeControl1
            // 
            this.nativeControl1.BackColor = System.Drawing.SystemColors.ActiveCaption;
            this.nativeControl1.Location = new System.Drawing.Point(12, 27);
            this.nativeControl1.Name = "nativeControl1";
            this.nativeControl1.Size = new System.Drawing.Size(1024, 768);
            this.nativeControl1.TabIndex = 0;
            // 
            // colladaToolStripMenuItem
            // 
            this.colladaToolStripMenuItem.DropDownItems.AddRange(new System.Windows.Forms.ToolStripItem[] {
            this.ripColladaFileToolStripMenuItem});
            this.colladaToolStripMenuItem.Name = "colladaToolStripMenuItem";
            this.colladaToolStripMenuItem.Size = new System.Drawing.Size(59, 20);
            this.colladaToolStripMenuItem.Text = "Collada";
            // 
            // ripColladaFileToolStripMenuItem
            // 
            this.ripColladaFileToolStripMenuItem.Name = "ripColladaFileToolStripMenuItem";
            this.ripColladaFileToolStripMenuItem.Size = new System.Drawing.Size(155, 22);
            this.ripColladaFileToolStripMenuItem.Text = "Rip Collada File";
            this.ripColladaFileToolStripMenuItem.Click += new System.EventHandler(this.ripColladaFileToolStripMenuItem_Click);
            // 
            // Form1
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(6F, 13F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.ClientSize = new System.Drawing.Size(1365, 809);
            this.Controls.Add(this.treeView1);
            this.Controls.Add(this.propertyGrid1);
            this.Controls.Add(this.nativeControl1);
            this.Controls.Add(this.menuStrip1);
            this.MainMenuStrip = this.menuStrip1;
            this.Name = "Form1";
            this.Text = "Form1";
            this.Load += new System.EventHandler(this.Form1_Load);
            this.menuStrip1.ResumeLayout(false);
            this.menuStrip1.PerformLayout();
            this.ResumeLayout(false);
            this.PerformLayout();

        }

        #endregion

        private NativeControl nativeControl1;
        private System.Windows.Forms.PropertyGrid propertyGrid1;
        private System.Windows.Forms.TreeView treeView1;
        private System.Windows.Forms.MenuStrip menuStrip1;
        private System.Windows.Forms.ToolStripMenuItem sceneToolStripMenuItem;
        private System.Windows.Forms.ToolStripMenuItem openSceneToolStripMenuItem;
        private System.Windows.Forms.ToolStripMenuItem colladaToolStripMenuItem;
        private System.Windows.Forms.ToolStripMenuItem ripColladaFileToolStripMenuItem;

    }
}

