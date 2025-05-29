#!/bin/bash

IMAGE_NAME="emirgenjac/snake-game:latest"
LOCAL_CONTAINER_NAME="snake-game-local-test"
LOCAL_PORT="8080" 

echo "--- Building Docker image: $IMAGE_NAME ---"

docker build -t "$IMAGE_NAME" .


if [ $? -ne 0 ]; then
    echo "ERROR: Docker image build failed. Please check the Dockerfile and logs above."
    exit 1
fi

echo "SUCCESS: Docker image '$IMAGE_NAME' built successfully!"
echo "You can now push this image to a Docker Registry (e.g., Docker Hub) or use it directly with Render."

echo ""
echo "--- Optional: Run for Local Testing (http://localhost:$LOCAL_PORT) ---"
echo "To test your container locally before deploying to Render:"
echo "1. Stopping and removing any existing local test container..."
docker stop "$LOCAL_CONTAINER_NAME" > /dev/null 2>&1 || true
docker rm "$LOCAL_CONTAINER_NAME" > /dev/null 2>&1 || true

echo "2. Running local test container..."
docker run -d -p "$LOCAL_PORT":80 --name "$LOCAL_CONTAINER_NAME" "$IMAGE_NAME"

if [ $? -eq 0 ]; then
    echo "SUCCESS: Your game is running locally at http://localhost:$LOCAL_PORT"
    echo "To stop the local test container, run: docker stop $LOCAL_CONTAINER_NAME"
    echo "To remove the local test container, run: docker rm $LOCAL_CONTAINER_NAME"
    echo "To view container logs: docker logs $LOCAL_CONTAINER_NAME"
else
    echo "WARNING: Failed to run local Docker container. You can still use the built image for Render."
fi

echo ""
echo "--- Next Steps for Render Deployment ---"
echo "If you want to push to Docker Hub (recommended for Render if not using direct build):"
echo "  docker push $IMAGE_NAME"
echo "Then, on Render, you can create a 'Web Service' and specify the '$IMAGE_NAME' from Docker Hub."
echo "Alternatively, Render can connect directly to your GitHub/GitLab repository and build the Docker image for you."