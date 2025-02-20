const DataCard = ({ dataTitle, dataDesc, dataValue }) => {
    return (
      <div
        style={{
          padding: 16,
          width: "48%",
          border: "1px solid #f9f9f9",
          borderRadius: 20,
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.05)",
          backgroundColor: "#fff",
          marginRight: 16,
        }}
      >
        <p style={{ fontSize: "1.5rem" }}>{dataTitle}</p>
        <p style={{ fontSize: "1rem", lineHeight: 1.1, color: "#808080", margin: "15px 0" }}>
          {dataDesc}
        </p>
        <p style={{ fontSize: "3.5rem", lineHeight: 1.1, color: "#000", margin: "15px 0" }}>
          {dataValue}
        </p>
      </div>
    );
  };
  
  export default DataCard;
  