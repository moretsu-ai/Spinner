// Math verification for pointer alignment on the wheel

function testPointerAlignment(numSegments) {
  const sliceAngle = (2 * Math.PI) / numSegments;
  const pointerAngle = (3 * Math.PI) / 2; // 12 o'clock

  for (let winningIndex = 0; winningIndex < numSegments; winningIndex++) {
    // Current rotation can be anything
    const currentRot = Math.random() * 20 * Math.PI;

    // Inside winning segment, pick multiple random offsets
    for (let sample = 0; sample < 10; sample++) {
      const segmentInnerOffset = sliceAngle * (0.2 + 0.6 * Math.random());
      const targetLocalAngle = winningIndex * sliceAngle + segmentInnerOffset;

      const fullSpins = 6 + Math.floor(Math.random() * 3);
      const baseRotations = fullSpins * 2 * Math.PI;

      let angleDifference = (pointerAngle - targetLocalAngle - currentRot) % (2 * Math.PI);
      if (angleDifference < 0) {
        angleDifference += 2 * Math.PI;
      }

      const totalAngleChange = baseRotations + angleDifference;
      const targetRotation = currentRot + totalAngleChange;

      // Now verify when the wheel stops at targetRotation:
      // What is the local angle under pointer?
      const localUnderPointer = ((pointerAngle - targetRotation) % (2 * Math.PI) + 2 * Math.PI) % (2 * Math.PI);
      const detectedSegment = Math.floor(localUnderPointer / sliceAngle);

      if (detectedSegment !== winningIndex) {
        throw new Error(
          `Mismatch for N=${numSegments}, expected ${winningIndex}, got ${detectedSegment}`
        );
      }
    }
  }
}

console.log('Testing wheel math across various segment counts:');
for (const n of [2, 3, 5, 8, 12, 17, 24, 35, 50]) {
  testPointerAlignment(n);
  console.log(`✓ Tested N=${n} segments: 100% exact pointer alignment`);
}
console.log('ALL MATH CHECKS PASSED PERFECTLY!');

