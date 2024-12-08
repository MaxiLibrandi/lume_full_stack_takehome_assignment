export default function Cell({ value, error }: { value: string; error: any }) {
    return (
        <td
            title={error ? error.message : ""}
            style={{
                backgroundColor: error ?
                    error.severity === "critical" ? "red" :
                    error.severity === "warning" ? "yellow" :
                            "green" : "green"
            }}
        >
            {value}
        </td>
    );
}