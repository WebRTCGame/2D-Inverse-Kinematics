var pi = [];
for (var i = -3;i<4;i)

function onLoad() {

	var endEffectorName = "end";

	var jointDescs = [{

		rootName: "n0",
		length: 10,
		angle: Math.PI / 2,
		joints: [{

			length: 15,
			angle: Math.PI / 6,
			joints: [{

				lname: endEffectorName,
				length: 15,
				angle: Math.PI / 2,
			},{

				lname: endEffectorName,
				length: 15,
				angle: Math.PI / 2,
			}]
		}]
	}, {

		rootName: "n0",
		length: 20,
		angle: Math.PI / 3,
		joints: [{

			length: 15,
			angle: -Math.PI / 3,
			joints: [{

				length: 18,
				angle: -Math.PI / 3,
				joints: [{

					length: 18,
					angle: Math.PI / 2,
					joints: [{

						lname: endEffectorName,
						length: 18,
						angle: Math.PI / 3
					}]
				}]
			}]
		}]
	}, {

		rootName: "n0",
		length: 20,
		angle: 0,
		joints: [{

			length: 15,
			angle: -Math.PI / 3 * 2,
			joints: [{

				lname: endEffectorName,
				length: 18,
				angle: Math.PI / 3,
			}]
		}]
	}, {

		rootName: "n0",
		length: 30,
		angle: Math.PI / 4 * 3,
		joints: [{

			lname: endEffectorName,
			length: 25,
			angle: -Math.PI / 6,
		}]
	}];

	var rootPositions = [[-100, -10], [-20, 40], [0, -40], [100, 20]];
	var goalCenterPositions = [[-65, -10], [-30, -10], [20, -10], [60, -10]];
	var goalPositions = [[-65, -10], [-30, -10], [20, -10], [60, -10]];

	// Parse the joint descriptions and store the joint hierarchies.
	var jointSets = [];
	for (var i = 0; i < jointDescs.length; ++i) {
		jointSets.push(IK.jointHierFromJs(jointDescs[i]));
	}

	// Store references to the end effectors.
	var endEffectors = [];
	for (var i = 0; i < jointSets.length; ++i) {
		var jointSet = jointSets[i];
		endEffectors.push(jointSet.unode.bfsFindNode(endEffectorName));
	}

	// Time step for solving IK.
	var dt = 1 / 30;

	// Set up rendering environment.
	var canvas = document.getElementById("splash_canvas");
	var context = canvas.getContext("2d");
	var flipbook = new fb.Flipbook({

		w: 200,
		h: 64,
		cx: 0,
		cy: 0,
		canvasId: "splash_canvas",
		retain: false
	});

	// Set up scene and update callback.

	for (var i = 0; i < jointSets.length; ++i) {

		// Construct the display elements for each joint hierarchy.

		var jointSet = jointSets[i];
		var rootPos = rootPositions[i];

		// All the shapes for a joint hierarchy are contained in this
		// composition.
		var jointSetComp = new fb.Composite({
			transforms: [["t", [rootPos[0], rootPos[1]]]]
		});

		var constructDisplay = function(node) {

			var rtrans2 = node.getRootTrans();
			var pos2 = IK.mtranspose(IK.mmult(rtrans2, IK.mtranspose([[0, 0, 1]])))[0].splice(0, 2);

			// The end shape is either a screw connecting two arms
			// or the tip of the end arm.

			var endShape = null;

			var rscrew = 2;
			var rtip = 1;

			if (node.joints.length == 0) {

				endShape = new fb.Circle({
					center: pos2,
					radius: rtip,
					strokeStyle: "green",
					lineWidth: 0.1
				});

			}
			else {

				endShape = new fb.Circle({
					center: pos2,
					radius: rscrew,
					strokeStyle: "orange",
					lineWidth: 0.1
				});
			}
			node.endShape = endShape;

			jointSetComp.children.push(endShape);

			// Make a shape for the joint with the node being the
			// lower end, if there is one.

			var pjoint = node.pjoint;
			if (pjoint == null) {
				return;
			}

			// Set the length and sizes of ends of the arm (joint).
			var armLength = pjoint.length;
			var halfSmallWidth = 0.5;
			var halfLargeWidth = 2.5;

			var armShape = new fb.Composite({

				children: [new fb.Path({

					vers: [[-armLength - halfLargeWidth, rscrew], [-armLength, halfLargeWidth], [rscrew, halfSmallWidth], [rscrew, -halfSmallWidth], [-armLength, -halfLargeWidth], [-armLength - halfLargeWidth, -rscrew]],
					close: true,
					strokeStyle: "rgba(119, 204, 221, 0.7)",
					fillStyle: "rgba(153, 238, 255, 0.1)",
					lineWidth: 0.2

				}), new fb.Path({

					vers: [[0, 0], [-armLength, 0]],
					strokeStyle: "#def",
					lineWidth: 0.2
				})],
				transforms: [[rtrans2[0][0], rtrans2[1][0], rtrans2[0][1], rtrans2[1][1], rtrans2[0][2], rtrans2[1][2]]],
			});
			node.armShape = armShape;

			jointSetComp.children.push(armShape);
		};

		// Traverse the joint hierarchy to make shapes for each node and joint.
		jointSet.unode.bfs(constructDisplay);

		// Add the entire composition to the scene.
		flipbook.scene.push(jointSetComp);
	};

	// Add the text of my name to the scene.

	var text = "TEST";
	var textShapes = [];
	// Used to set the letter space more even.
	var charOffsets = [[0, 0], [0, 0], [-12, 0], [-20, 0]];

	for (var i = 0; i < text.length; ++i) {

		var textShape = new fb.Text({

			text: text[i],
			font: "20px 'Times New Roman'",
			fillStyle: "rgba(0, 0, 0, 0.4)",
			lineWidth: 0.4
		});

		textShapes.push(textShape);
		flipbook.scene.push(textShape);
	};

	// Add a animation callback function to step the IK.

	var updateJoints = function() {

		var updateDisplay = function(node) {

			var rtrans2 = node.getRootTrans();
			var pos2 = IK.mtranspose(IK.mmult(rtrans2, IK.mtranspose([[0, 0, 1]])))[0].splice(0, 2);

			// Update the position of the node shape.
			node.endShape.center = pos2;

			// Update the transformation of the joint shape if there is one.
			if (node.armShape != null) {
				node.armShape.transforms = [[rtrans2[0][0], rtrans2[1][0], rtrans2[0][1], rtrans2[1][1], rtrans2[0][2], rtrans2[1][2]]];
			}
		};

		for (var i = 0; i < jointSets.length; ++i) {

			var jointSet = jointSets[i];
			var endEffector = endEffectors[i];
			var goalPos = goalPositions[i];
			var rootPos = rootPositions[i];
			// The goal position in the joint root coordinates.
			var relGoalPos = [goalPos[0] - rootPos[0], goalPos[1] - rootPos[1]];
			var curEndPos = endEffector.getRootCoordPos();

			// Stop stepping the IK if the goal position is close enough.
			var eps = 1e-6;
			if (IK.vmag2(IK.vsub(relGoalPos, curEndPos)) < eps) continue;

			endEffector.stepIk(relGoalPos, dt);

			var endEffectorPos = endEffector.getRootCoordPos();
			// Update the position of the characters in the text so that they
			// follow the end effectors.
			textShapes[i].pos = [endEffectorPos[0] + rootPos[0] + charOffsets[i][0], endEffectorPos[1] + rootPos[1], +charOffsets[i][1]];

			// Traverse the joint hierarchy to update all display elements.
			jointSet.unode.bfs(updateDisplay);
		}

	};

	// Add the update callback function for each joint hierarchy.
	flipbook.callbacks.push(updateJoints);

	// Move the goal positions around on orbits (to keep the joints moving).

	var goalAngles = [-Math.PI / 4, -Math.PI / 6, 0, Math.PI / 3];
	var goalAngleVelocities = [-0.2, -0.2, 0.15, -0.2];
	var goalRadii = [2, 6, 2, 3];

	var updateGoals = function() {

		// Move some or all of them.
		for (var i = 1; i < 2; ++i) {

			var goalCenterPos = goalCenterPositions[i];
			var goalPos = [goalCenterPos[0] + Math.cos(goalAngles[i]) * goalRadii[i], goalCenterPos[1] + Math.sin(goalAngles[i]) * goalRadii[i]];
			goalAngles[i] += goalAngleVelocities[i] * dt;
			goalPositions[i] = goalPos;
		}
	};

	// If the orbiting is undesired, just comment this line out. 
	flipbook.callbacks.push(updateGoals);

	// Start animation.
	flipbook.play();
}

window.addEventListener("load", onLoad, false);
