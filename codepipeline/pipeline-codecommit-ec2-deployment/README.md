# CodePipeline 
Templates create the required underlying infratructure & resources for a CI/CD CodePipeline.

This pipeline uses CodeCommit for SCM. 

The Pipeline has a Source Stage and Deploy stage.  The Source stage obtains the required files from the CodeCommit repository and packages them into an artifact.  The Deploy stage utilizes CodeDeploy to deploy the code to EC2 instances in a Deployment Group.

The pipeline is automatically trigger by an EventBride rule that monitors the CodeCommit repository for changes.