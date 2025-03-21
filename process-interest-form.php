<?php
// Set headers for AJAX response
header('Content-Type: application/json');

// Database connection parameters
$host = 'localhost';
$dbname = 'uiucitbp_uiucevent_forms'; // Replace with your actual database name
$username = 'uiucitbp_user'; // Replace with your actual username
$password = 'fozsog-mappib-tutPy0'; 

try {
    // Create database connection
    $conn = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    // Get form data
    $name = $_POST['name'] ?? '';
    $email = $_POST['email'] ?? '';
    $phone = $_POST['phone'] ?? '';
    $eventType = $_POST['event-type'] ?? '';
    $timeframe = $_POST['timeframe'] ?? '';
    $package = $_POST['package'] ?? '';
    $groupSize = $_POST['interest-group-size'] ?? '';
    $notes = $_POST['notes'] ?? '';
    
    // Prepare SQL statement
    $stmt = $conn->prepare("INSERT INTO interest_submissions 
                          (name, email, phone, event_type, timeframe, package, group_size, notes) 
                          VALUES (:name, :email, :phone, :event_type, :timeframe, :package, :group_size, :notes)");
    
    // Bind parameters
    $stmt->bindParam(':name', $name);
    $stmt->bindParam(':email', $email);
    $stmt->bindParam(':phone', $phone);
    $stmt->bindParam(':event_type', $eventType);
    $stmt->bindParam(':timeframe', $timeframe);
    $stmt->bindParam(':package', $package);
    $stmt->bindParam(':group_size', $groupSize);
    $stmt->bindParam(':notes', $notes);
    
    // Execute statement
    $stmt->execute();

    // Add this inside the try block after $stmt->execute();
    $to = "uiuceventsphotos@gmail.com"; // Change this to your actual email address
    $subject = "New Photography Interest Form Submission";

    // Build a complete message with all interest form fields
    $message = "Name: $name\n";
    $message .= "Email: $email\n";
    $message .= "Phone: $phone\n";
    $message .= "Event Type: $eventType\n";
    $message .= "Timeframe: $timeframe\n";

    // Only include these fields if they're part of the interest form
    if (!empty($package)) {
        $message .= "Package: $package\n";
    }

    if (!empty($groupSize)) {
        $message .= "Group Size: $groupSize\n";
    }

    if (!empty($notes)) {
        $message .= "Additional Notes: $notes\n";
    }

    // Add submission timestamp
    $message .= "\nSubmitted on: " . date("Y-m-d H:i:s");
    $message .= "\nForm Type: Quick Interest Form";

    // Headers for better email handling
    $headers = "From: UIUC Event Photos <noreply@uiuceventphotos.com>\r\n";
    $headers .= "Reply-To: $email\r\n";
    $headers .= "X-Mailer: PHP/" . phpversion();

    // Send the email
    mail($to, $subject, $message, $headers);
    
    // Return success response
    echo json_encode(['success' => true, 'message' => 'Form submitted successfully']);
    
} catch(PDOException $e) {
    // Return error response
    echo json_encode(['success' => false, 'message' => 'Error: ' . $e->getMessage()]);
    
    // Log error (optional)
    error_log('Form submission error: ' . $e->getMessage());
}
?>