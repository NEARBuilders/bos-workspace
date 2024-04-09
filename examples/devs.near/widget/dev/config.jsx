const path =
  props.path || `${props.accountId || context.accountId}/settings/**`;
const blockHeight = props.blockHeight || "final";

if (accountId === null) {
  return <p>Please connect a NEAR account...</p>;
}

const settings = Social.get(path, blockHeight);

if (!settings) {
  return <p>Loading...</p>;
}

const FormContainer = styled.div`
  width: 500px;
  margin: 0 auto;
`;

const SectionTitle = styled.h2`
  font-size: 24px;
  margin-top: 20px;
`;

const SectionContainer = styled.div`
  border: 1px solid #ccc;
  padding: 10px;
  margin-bottom: 20px;
`;

const FormGroup = styled.div`
  margin-bottom: 10px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 5px;
  font-size: 18px;
`;

const InputContainer = styled.div`
  display: flex;
  align-items: center;
`;

const Input = styled.input`
  width: 100%;
  padding: 8px;
`;

const Button = styled.button`
  margin-left: 5px;
`;

State.init({
  formData: settings,
  modifiedInputs: {},
});

function composeData(section) {
  const modifiedData = Object.entries(state.modifiedInputs).reduce(
    (result, [key, value]) => {
      const [currentSection, currentKey] = key.split("/");
      if (currentSection === section && value) {
        const [_, index] = currentKey.split("/");
        const parsedIndex = parseInt(index, 10);
        if (Number.isInteger(parsedIndex)) {
          if (!result[currentSection]) {
            result[currentSection] = {};
          }
          if (!result[currentSection][currentKey]) {
            result[currentSection][currentKey] = [];
          }
          result[currentSection][currentKey][parsedIndex] =
            state.formData[currentSection][currentKey][parsedIndex];
        } else {
          if (!result[currentSection]) {
            result[currentSection] = {};
          }
          result[currentSection][currentKey] =
            state.formData[currentSection][currentKey];
        }
      }
      return result;
    },
    {}
  );
  return modifiedData;
}

const handleInputChange = (section, key, index, value) => {
  const updatedData = { ...state.formData };
  const modifiedInputs = { ...state.modifiedInputs };

  if (Array.isArray(JSON.parse(updatedData[section][key]))) {
    try {
      const inputs = JSON.parse(updatedData[section][key]);
      const originalValue = JSON.parse(settings[section][key]);

      inputs[index].src = value;
      updatedData[section][key] = JSON.stringify(inputs);

      modifiedInputs[`${section}/${key}/${index}`] =
        inputs[index].src !== originalValue[index].src;

      State.update({ formData: updatedData, modifiedInputs });
    } catch (error) {
      console.log(
        `Error updating input value for ${section}/${key}/${index}:`,
        error
      );
    }
  } else {
    const originalValue = settings[section][key];
    updatedData[section][key] = value;

    modifiedInputs[`${section}/${key}/0`] =
      updatedData[section][key] !== originalValue;

    State.update({ formData: updatedData, modifiedInputs });
  }
};
const moveInputUp = (section, key, index) => {
  const updatedData = { ...state.formData };
  const modifiedInputs = { ...state.modifiedInputs };

  try {
    const inputs = JSON.parse(updatedData[section][key]);

    if (index > 0) {
      const temp = inputs[index];
      inputs[index] = inputs[index - 1];
      inputs[index - 1] = temp;

      const currentModifiedKey = `${section}/${key}/${index}`;
      const previousModifiedKey = `${section}/${key}/${index - 1}`;

      // Check if the current input value matches the original value
      const originalValue = JSON.parse(settings[section][key]);
      const isCurrentInputModified =
        inputs[index].src !== originalValue[index].src;
      const isPreviousInputModified =
        inputs[index - 1].src !== originalValue[index - 1].src;

      modifiedInputs[currentModifiedKey] = isCurrentInputModified;
      modifiedInputs[previousModifiedKey] = isPreviousInputModified;

      // Remove modified flag if the inputs match the original values
      if (!isCurrentInputModified) {
        delete modifiedInputs[currentModifiedKey];
      }
      if (!isPreviousInputModified) {
        delete modifiedInputs[previousModifiedKey];
      }

      updatedData[section][key] = JSON.stringify(inputs);

      State.update({ formData: updatedData, modifiedInputs });
    }
  } catch (error) {
    console.log(`Error moving input up for ${section}/${key}/${index}:`, error);
  }
};

const moveInputDown = (section, key, index) => {
  const updatedData = { ...state.formData };
  const modifiedInputs = { ...state.modifiedInputs };

  try {
    const inputs = JSON.parse(updatedData[section][key]);

    if (index < inputs.length - 1) {
      const temp = inputs[index];
      inputs[index] = inputs[index + 1];
      inputs[index + 1] = temp;

      const currentModifiedKey = `${section}/${key}/${index}`;
      const nextModifiedKey = `${section}/${key}/${index + 1}`;

      // Check if the current input value matches the original value
      const originalValue = JSON.parse(settings[section][key]);
      const isCurrentInputModified =
        inputs[index].src !== originalValue[index].src;
      const isNextInputModified =
        inputs[index + 1].src !== originalValue[index + 1].src;

      modifiedInputs[currentModifiedKey] = isCurrentInputModified;
      modifiedInputs[nextModifiedKey] = isNextInputModified;

      // Remove modified flag if the inputs match the original values
      if (!isCurrentInputModified) {
        delete modifiedInputs[currentModifiedKey];
      }
      if (!isNextInputModified) {
        delete modifiedInputs[nextModifiedKey];
      }

      updatedData[section][key] = JSON.stringify(inputs);

      State.update({ formData: updatedData, modifiedInputs });
    }
  } catch (error) {
    console.log(
      `Error moving input down for ${section}/${key}/${index}:`,
      error
    );
  }
};

return (
  <FormContainer>
    <h1>settings</h1>
    {Object.entries(state.formData).map(([section, values]) => (
      <SectionContainer key={section}>
        <SectionTitle>{section}</SectionTitle>
        {Object.entries(values).map(([key, input]) => {
          let parsedInput = JSON.parse(input);
          if (parsedInput === null) {
            parsedInput = input;
          }
          return (
            <FormGroup key={key}>
              <Label>{key}</Label>
              {Array.isArray(parsedInput) ? (
                parsedInput.map((item, index) => {
                  return (
                    <InputContainer key={index}>
                      <Input
                        type="text"
                        value={item.src}
                        style={{
                          border: state.modifiedInputs[
                            `${section}/${key}/${index}`
                          ]
                            ? "2px solid #f00"
                            : "1px solid #ccc",
                        }}
                        onChange={(e) =>
                          handleInputChange(section, key, index, e.target.value)
                        }
                      />
                      <Button
                        onClick={() => moveInputUp(section, key, index)}
                        disabled={index === 0}
                      >
                        &uarr;
                      </Button>
                      <Button
                        onClick={() => moveInputDown(section, key, index)}
                        disabled={index === parsedInput.length - 1}
                      >
                        &darr;
                      </Button>
                    </InputContainer>
                  );
                })
              ) : (
                <InputContainer>
                  <Input
                    type="text"
                    value={parsedInput}
                    style={{
                      border: state.modifiedInputs[`${section}/${key}/0`]
                        ? "2px solid #f00"
                        : "1px solid #ccc",
                    }}
                    onChange={(e) =>
                      handleInputChange(section, key, 0, e.target.value)
                    }
                  />
                </InputContainer>
              )}
            </FormGroup>
          );
        })}
        <CommitButton
          force
          data={() => composeData(section)}
          disabled={!Object.keys(composeData(section)).length}
          className="styless"
        >
          save
        </CommitButton>
      </SectionContainer>
    ))}
  </FormContainer>
);
