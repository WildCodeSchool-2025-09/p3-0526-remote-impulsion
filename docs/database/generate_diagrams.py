from pathlib import Path

from PIL import Image, ImageDraw, ImageFont


OUTPUT_DIR = Path(__file__).resolve().parent
FONT_REGULAR = Path("C:/Windows/Fonts/segoeui.ttf")
FONT_BOLD = Path("C:/Windows/Fonts/segoeuib.ttf")

COLORS = {
    "background": "#ffffff",
    "ink": "#282828",
    "line": "#999999",
    "green_fill": "#d9f1e7",
    "green_border": "#49aa8b",
    "green_text": "#086b53",
    "orange_fill": "#fdebd2",
    "orange_border": "#e6a04a",
    "orange_text": "#985b18",
    "blue_fill": "#dbe9fb",
    "blue_border": "#6f9edb",
    "blue_text": "#20558d",
    "assoc_fill": "#f2eee6",
    "assoc_border": "#b9ad98",
    "assoc_text": "#5b5144",
    "warning": "#a75c18",
}


def font(size: int, bold: bool = False) -> ImageFont.FreeTypeFont:
    return ImageFont.truetype(str(FONT_BOLD if bold else FONT_REGULAR), size)


def centered(draw: ImageDraw.ImageDraw, xy: tuple[int, int], text: str, fnt, fill: str):
    box = draw.textbbox((0, 0), text, font=fnt)
    draw.text((xy[0] - (box[2] - box[0]) / 2, xy[1] - (box[3] - box[1]) / 2), text, font=fnt, fill=fill)


def line(draw: ImageDraw.ImageDraw, a: tuple[int, int], b: tuple[int, int], label: str | None = None, label_pos: tuple[int, int] | None = None, width: int = 3):
    draw.line((a, b), fill=COLORS["line"], width=width)
    if label and label_pos:
        centered(draw, label_pos, label, font(20, True), COLORS["warning"])


def entity(
    draw: ImageDraw.ImageDraw,
    box: tuple[int, int, int, int],
    title: str,
    fields: list[str],
    family: str,
    *,
    types: list[str] | None = None,
    pk_rows: set[int] | None = None,
    title_size: int = 28,
    field_size: int = 21,
):
    x1, y1, x2, y2 = box
    fill = COLORS[f"{family}_fill"]
    border = COLORS[f"{family}_border"]
    text_color = COLORS[f"{family}_text"]
    draw.rounded_rectangle(box, radius=22, fill=fill, outline=border, width=3)
    centered(draw, ((x1 + x2) // 2, y1 + 30), title, font(title_size, True), text_color)
    top = y1 + 65
    available = y2 - top - 18
    step = max(24, available // max(1, len(fields)))
    fnt = font(field_size)
    type_fnt = font(max(16, field_size - 3))
    for index, value in enumerate(fields):
        y = top + index * step
        draw.text((x1 + 24, y), value, font=fnt, fill=text_color)
        if pk_rows and index in pk_rows:
            width = draw.textlength(value, font=fnt)
            draw.line((x1 + 24, y + field_size + 3, x1 + 24 + width, y + field_size + 3), fill=text_color, width=2)
        if types:
            type_text = types[index]
            type_width = draw.textlength(type_text, font=type_fnt)
            draw.text((x2 - 24 - type_width, y + 2), type_text, font=type_fnt, fill="#7d8585")


def association(draw: ImageDraw.ImageDraw, center: tuple[int, int], size: tuple[int, int], title: str, subtitle: str | None = None):
    cx, cy = center
    w, h = size
    draw.ellipse((cx - w // 2, cy - h // 2, cx + w // 2, cy + h // 2), fill=COLORS["assoc_fill"], outline=COLORS["assoc_border"], width=3)
    centered(draw, (cx, cy - (10 if subtitle else 0)), title, font(23, True), COLORS["assoc_text"])
    if subtitle:
        centered(draw, (cx, cy + 20), subtitle, font(18), COLORS["assoc_text"])


def label(draw: ImageDraw.ImageDraw, pos: tuple[int, int], value: str):
    centered(draw, pos, value, font(19), "#666666")


def polyline(draw: ImageDraw.ImageDraw, points: list[tuple[int, int]], width: int = 3):
    draw.line(points, fill=COLORS["line"], width=width, joint="curve")


def cardinality(draw: ImageDraw.ImageDraw, pos: tuple[int, int], value: str):
    fnt = font(22, True)
    text_box = draw.textbbox((0, 0), value, font=fnt)
    width = text_box[2] - text_box[0] + 22
    height = text_box[3] - text_box[1] + 14
    x, y = pos
    draw.rounded_rectangle(
        (x - width // 2, y - height // 2, x + width // 2, y + height // 2),
        radius=10,
        fill="#ffffff",
        outline="#6f6f6f",
        width=2,
    )
    centered(draw, pos, value, fnt, "#3f3f3f")


def title_and_note(draw: ImageDraw.ImageDraw, width: int, title: str, legend: str, image_note: bool = True):
    centered(draw, (width // 2, 44), title, font(36, True), COLORS["ink"])
    draw.text((42, 24), legend, font=font(18), fill="#666666")
    if image_note:
        note = "Images hors BDD : /assets/images/{slug}.jpg  ·  Cartes musculaires : /assets/muscle-maps/{slug}.svg"
        centered(draw, (width // 2, 91), note, font(19), "#666666")


def make_mcd():
    width, height = 2850, 2200
    image = Image.new("RGB", (width, height), COLORS["background"])
    draw = ImageDraw.Draw(image)
    title_and_note(draw, width, "Modèle Conceptuel de Données (MCD) — Impulsion", "Cardinalités Merise : minimum,maximum")

    boxes = {
        "user": (1100, 130, 1500, 410),
        "program": (130, 440, 520, 710),
        "template": (130, 850, 570, 1090),
        "template_ex": (70, 1300, 690, 1635),
        "session": (2080, 440, 2470, 720),
        "session_ex": (2020, 850, 2530, 1185),
        "set": (2070, 1370, 2490, 1655),
        "exercise": (1080, 1305, 1520, 1600),
        "difficulty": (390, 1990, 680, 2150),
        "category": (810, 1990, 1100, 2150),
        "muscle": (1490, 1990, 1810, 2150),
        "equipment": (1950, 1990, 2250, 2150),
    }

    # Each relation uses its own orthogonal lane to avoid crossings.
    polyline(draw, [(1100, 255), (790, 255), (790, 365), (620, 365), (620, 575), (520, 575)])
    polyline(draw, [(1500, 255), (1810, 255), (1810, 365), (1980, 365), (1980, 575), (2080, 575)])
    polyline(draw, [(325, 710), (325, 850)])
    polyline(draw, [(350, 1090), (350, 1300)])
    polyline(draw, [(690, 1470), (1080, 1470)])
    polyline(draw, [(2275, 720), (2275, 850)])
    polyline(draw, [(2020, 1080), (1760, 1080), (1760, 1450), (1520, 1450)])
    polyline(draw, [(2280, 1185), (2280, 1370)])
    polyline(draw, [(2470, 520), (2555, 520), (2555, 555)])
    polyline(draw, [(2555, 595), (2520, 595), (2520, 650), (2470, 650)])
    polyline(draw, [(570, 960), (760, 960), (760, 790), (1190, 790)])
    polyline(draw, [(1410, 790), (1900, 790), (1900, 610), (2080, 610)])
    polyline(draw, [(1140, 1600), (1140, 1680), (535, 1680), (535, 1990)])
    polyline(draw, [(1225, 1600), (1225, 1740), (955, 1740), (955, 1990)])
    polyline(draw, [(1370, 1600), (1370, 1740), (1650, 1740), (1650, 1990)])
    polyline(draw, [(1450, 1600), (1450, 1680), (2100, 1680), (2100, 1990)])

    association(draw, (790, 365), (235, 82), "POSSEDER")
    association(draw, (1810, 365), (225, 82), "REALISER")
    association(draw, (325, 780), (220, 78), "INCLURE")
    association(draw, (350, 1195), (225, 78), "CONTENIR")
    association(draw, (885, 1470), (220, 78), "PREVOIR")
    association(draw, (2275, 785), (235, 78), "COMPOSER")
    association(draw, (1760, 1270), (235, 78), "PORTER_SUR")
    association(draw, (2280, 1275), (235, 78), "COMPORTER")
    association(draw, (2670, 575), (230, 82), "REPRENDRE")
    association(draw, (1300, 790), (245, 82), "PROVENIR")
    association(draw, (535, 1845), (225, 80), "QUALIFIER")
    association(draw, (955, 1845), (225, 80), "CLASSER")
    association(draw, (1650, 1845), (225, 95), "CIBLER", "role")
    association(draw, (2100, 1845), (245, 80), "NECESSITER")

    entity(draw, boxes["user"], "USER", ["id", "username", "email", "password", "theme", "last_login_at (opt.)", "created_at"], "green")
    entity(draw, boxes["program"], "PROGRAM", ["id", "name", "description (opt.)", "created_at", "updated_at"], "green")
    entity(draw, boxes["template"], "WORKOUT_TEMPLATE", ["id", "name", "estimated_duration_minutes (opt.)", "position"], "green", field_size=19)
    entity(draw, boxes["template_ex"], "WORKOUT_TEMPLATE_EXERCISE", ["id", "position", "target_sets", "target_reps (opt.)", "target_weight_kg (opt.)", "target_duration_seconds (opt.)", "rest_seconds (opt.)"], "green", field_size=20)
    entity(draw, boxes["session"], "WORKOUT_SESSION", ["id", "created_at", "started_at (opt.)", "ended_at (opt.)", "status", "notes (opt.)"], "blue")
    entity(draw, boxes["session_ex"], "WORKOUT_SESSION_EXERCISE", ["id", "position", "target_sets (opt.)", "target_reps (opt.)", "target_weight_kg (opt.)", "target_duration_seconds (opt.)", "rest_seconds (opt.)"], "blue", field_size=20)
    entity(draw, boxes["set"], "EXERCISE_SET", ["id", "set_number", "repetitions (opt.)", "weight_kg (opt.)", "duration_seconds (opt.)", "is_completed"], "blue")
    entity(draw, boxes["exercise"], "EXERCISE", ["id", "slug", "name", "description"], "orange")
    entity(draw, boxes["difficulty"], "DIFFICULTY", ["id", "name"], "orange")
    entity(draw, boxes["category"], "CATEGORY", ["id", "name"], "orange")
    entity(draw, boxes["muscle"], "MUSCLE_GROUP", ["id", "name"], "orange")
    entity(draw, boxes["equipment"], "EQUIPMENT", ["id", "name"], "orange")

    # High-contrast cardinality badges, positioned at relationship endpoints.
    for pos, value in [
        ((1060, 255), "0,N"), ((560, 575), "1,1"), ((1540, 255), "0,N"), ((2040, 575), "1,1"),
        ((325, 730), "0,N"), ((325, 830), "1,1"), ((350, 1110), "0,N"), ((350, 1280), "1,1"),
        ((720, 1470), "1,1"), ((1050, 1470), "0,N"), ((2275, 740), "0,N"), ((2275, 830), "1,1"),
        ((1990, 1080), "1,1"), ((1550, 1450), "0,N"), ((2280, 1205), "0,N"), ((2280, 1350), "1,1"),
        ((600, 960), "0,N"), ((2050, 610), "0,1"), ((1140, 1625), "1,1"), ((535, 1970), "0,N"),
        ((1225, 1625), "1,1"), ((955, 1970), "0,N"), ((1370, 1625), "1,N"), ((1650, 1970), "0,N"),
        ((1450, 1625), "0,N"), ((2100, 1970), "0,N"),
        ((2500, 520), "0,1"), ((2500, 650), "0,N"),
    ]:
        cardinality(draw, pos, value)

    image.save(OUTPUT_DIR / "MCD_Impulsion_final.png", quality=95)


def make_mld():
    width, height = 2600, 2537
    image = Image.new("RGB", (width, height), COLORS["background"])
    draw = ImageDraw.Draw(image)
    title_and_note(draw, width, "Modèle Logique de Données (MLD) — Impulsion", "Champ souligné = clé primaire  ·  # = clé étrangère  ·  UQ = contrainte unique")

    boxes = {
        "user": (1050, 130, 1450, 440), "program": (170, 520, 570, 810),
        "template": (170, 960, 600, 1230), "template_ex": (120, 1420, 720, 1805),
        "session": (1980, 520, 2420, 850), "session_ex": (1940, 1040, 2480, 1450),
        "set": (1990, 1630, 2430, 1940), "exercise": (1060, 1460, 1510, 1800),
        "difficulty": (100, 2140, 360, 2315), "category": (490, 2140, 750, 2315),
        "exercise_muscle": (1110, 2070, 1500, 2320), "muscle": (1145, 2360, 1465, 2510),
        "exercise_equipment": (1580, 2070, 1980, 2295), "equipment": (1630, 2350, 1930, 2510),
    }

    # Foreign-key lines.
    for a, b in [
        ((1050, 330), (570, 650)), ((1450, 330), (1980, 650)), ((370, 810), (370, 960)),
        ((385, 1230), (385, 1420)), ((720, 1600), (1060, 1600)), ((600, 1080), (1980, 740)),
        ((2200, 850), (2200, 1040)), ((1940, 1240), (1510, 1580)), ((2210, 1450), (2210, 1630)),
        ((360, 2220), (1120, 1740)), ((750, 2220), (1120, 1690)), ((1280, 1800), (1280, 2070)),
        ((1305, 2320), (1305, 2360)), ((1450, 1740), (1770, 2070)), ((1780, 2295), (1780, 2350)),
    ]:
        line(draw, a, b)

    entity(draw, boxes["user"], "user", ["id", "username", "email", "password", "theme", "last_login_at", "created_at"], "green", pk_rows={0})
    entity(draw, boxes["program"], "program", ["id", "#user_id", "name", "description", "created_at", "updated_at"], "green", pk_rows={0})
    entity(draw, boxes["template"], "workout_template", ["id", "#program_id", "name", "estimated_duration_minutes", "position (UQ/program)"], "green", pk_rows={0}, field_size=19)
    entity(draw, boxes["template_ex"], "workout_template_exercise", ["id", "#workout_template_id", "#exercise_id", "position (UQ/template)", "target_sets", "target_reps", "target_weight_kg", "target_duration_seconds", "rest_seconds", "UQ(template, exercise)"], "green", pk_rows={0}, field_size=18)
    entity(draw, boxes["session"], "workout_session", ["id", "#user_id", "#workout_template_id", "#source_workout_session_id", "created_at", "started_at", "ended_at", "status", "notes"], "blue", pk_rows={0}, field_size=18)
    entity(draw, boxes["session_ex"], "workout_session_exercise", ["id", "#workout_session_id", "#exercise_id", "position (UQ/session)", "target_sets", "target_reps", "target_weight_kg", "target_duration_seconds", "rest_seconds"], "blue", pk_rows={0}, field_size=18)
    entity(draw, boxes["set"], "exercise_set", ["id", "#workout_session_exercise_id", "set_number", "repetitions", "weight_kg", "duration_seconds", "is_completed"], "blue", pk_rows={0}, field_size=19)
    entity(draw, boxes["exercise"], "exercise", ["id", "slug (UQ)", "name", "description", "#category_id", "#difficulty_id"], "orange", pk_rows={0})
    entity(draw, boxes["difficulty"], "difficulty", ["id", "name (UQ)"], "orange", pk_rows={0})
    entity(draw, boxes["category"], "category", ["id", "name (UQ)"], "orange", pk_rows={0})
    entity(draw, boxes["exercise_muscle"], "exercise_muscle", ["#exercise_id", "#muscle_group_id", "role"], "orange", pk_rows={0, 1})
    entity(draw, boxes["muscle"], "muscle_group", ["id", "name (UQ)"], "orange", pk_rows={0})
    entity(draw, boxes["exercise_equipment"], "exercise_equipment", ["#exercise_id", "#equipment_id"], "orange", pk_rows={0, 1})
    entity(draw, boxes["equipment"], "equipment", ["id", "name (UQ)"], "orange", pk_rows={0})

    image.save(OUTPUT_DIR / "MLD_Impulsion_final.png", quality=95)


def make_mpd():
    width, height = 2900, 2427
    image = Image.new("RGB", (width, height), COLORS["background"])
    draw = ImageDraw.Draw(image)
    title_and_note(draw, width, "Modèle Physique de Données (MPD) — Impulsion", "Champ souligné = PK  ·  # = FK  ·  U = UNSIGNED  ·  IDX = index  ·  Suppression indiquée sur chaque relation")

    boxes = {
        "user": (1210, 125, 1700, 430), "program": (150, 500, 650, 800),
        "template": (150, 930, 680, 1220), "template_ex": (100, 1380, 760, 1795),
        "session": (2260, 500, 2780, 830), "session_ex": (2210, 1010, 2810, 1435),
        "set": (2280, 1610, 2780, 1925), "exercise": (1160, 1400, 1740, 1775),
        "difficulty": (80, 2080, 390, 2280), "category": (500, 2080, 810, 2280),
        "exercise_muscle": (1170, 1985, 1640, 2215), "muscle": (1220, 2250, 1590, 2405),
        "exercise_equipment": (1770, 1985, 2250, 2195), "equipment": (1830, 2240, 2190, 2405),
    }

    connections = [
        ((1210, 325), (650, 625), "CASCADE", (900, 455)), ((1700, 325), (2260, 625), "CASCADE", (1995, 455)),
        ((400, 800), (400, 930), "CASCADE", (470, 865)), ((415, 1220), (415, 1380), "CASCADE", (490, 1300)),
        ((760, 1585), (1160, 1585), "RESTRICT", (960, 1555)), ((680, 1040), (2260, 735), "SET NULL", (1460, 845)),
        ((2520, 830), (2520, 1010), "CASCADE", (2615, 920)), ((2210, 1210), (1740, 1560), "RESTRICT", (1970, 1350)),
        ((2520, 1435), (2520, 1610), "CASCADE", (2620, 1520)), ((390, 2180), (1200, 1705), "RESTRICT", (745, 1925)),
        ((810, 2180), (1200, 1660), "RESTRICT", (955, 1900)), ((1450, 1775), (1405, 1985), "CASCADE", (1485, 1880)),
        ((1405, 2215), (1405, 2250), "RESTRICT", (1495, 2230)), ((1710, 1715), (1990, 1985), "CASCADE", (1885, 1860)),
        ((2010, 2195), (2010, 2240), "RESTRICT", (2100, 2218)),
    ]
    for a, b, rel, pos in connections:
        line(draw, a, b, rel, pos)

    entity(draw, boxes["user"], "user", ["id", "username", "email", "password", "theme", "last_login_at", "created_at"], "green",
           types=["INT U", "VARCHAR(50) · UQ", "VARCHAR(255) · UQ", "VARCHAR(255)", "ENUM(light,dark,system)", "DATETIME · NULL", "DATETIME · DEFAULT CURRENT_TS"], pk_rows={0}, field_size=18)
    entity(draw, boxes["program"], "program", ["id", "#user_id", "name", "description", "created_at", "updated_at"], "green",
           types=["INT U", "INT U", "VARCHAR(100)", "TEXT · NULL", "DATETIME · DEFAULT CURRENT_TS", "DATETIME · AUTO UPDATE"], pk_rows={0}, field_size=18)
    entity(draw, boxes["template"], "workout_template", ["id", "#program_id", "name", "estimated_duration_minutes", "position"], "green",
           types=["INT U", "INT U", "VARCHAR(100)", "SMALLINT U · NULL", "SMALLINT U · UQ/program"], pk_rows={0}, field_size=18)
    entity(draw, boxes["template_ex"], "workout_template_exercise", ["id", "#workout_template_id", "#exercise_id", "position", "target_sets", "target_reps", "target_weight_kg", "target_duration_seconds", "rest_seconds", "UQ(template, exercise)"], "green",
           types=["INT U", "INT U", "INT U", "SMALLINT U · UQ/template", "SMALLINT U", "SMALLINT U · NULL", "DECIMAL(5,2) · NULL", "SMALLINT U · NULL", "SMALLINT U · NULL", "COMPOSITE"], pk_rows={0}, field_size=16)
    entity(draw, boxes["session"], "workout_session", ["id", "#user_id", "#workout_template_id", "#source_workout_session_id", "created_at", "started_at", "ended_at", "status", "notes"], "blue",
           types=["INT U", "INT U", "INT U · NULL", "INT U · NULL", "DATETIME · DEFAULT CURRENT_TS", "DATETIME · NULL", "DATETIME · NULL", "ENUM · DEFAULT prepared", "TEXT · NULL"], pk_rows={0}, field_size=16)
    entity(draw, boxes["session_ex"], "workout_session_exercise", ["id", "#workout_session_id", "#exercise_id", "position", "target_sets", "target_reps", "target_weight_kg", "target_duration_seconds", "rest_seconds", "UQ(session, exercise)"], "blue",
           types=["INT U", "INT U", "INT U", "SMALLINT U · UQ/session", "SMALLINT U · NULL", "SMALLINT U · NULL", "DECIMAL(5,2) · NULL", "SMALLINT U · NULL", "SMALLINT U · NULL", "COMPOSITE"], pk_rows={0}, field_size=16)
    entity(draw, boxes["set"], "exercise_set", ["id", "#workout_session_exercise_id", "set_number", "repetitions", "weight_kg", "duration_seconds", "is_completed", "UQ(session_exercise, set_number)"], "blue",
           types=["INT U", "INT U", "SMALLINT U", "SMALLINT U · NULL", "DECIMAL(5,2) · NULL", "SMALLINT U · NULL", "BOOLEAN · DEFAULT FALSE", "COMPOSITE"], pk_rows={0}, field_size=16)
    entity(draw, boxes["exercise"], "exercise", ["id", "slug", "name", "description", "#category_id", "#difficulty_id"], "orange",
           types=["INT U", "VARCHAR(100) · UQ", "VARCHAR(255) · IDX", "TEXT", "TINYINT U", "TINYINT U"], pk_rows={0}, field_size=19)
    entity(draw, boxes["difficulty"], "difficulty", ["id", "name"], "orange", types=["TINYINT U", "VARCHAR(50) · UQ"], pk_rows={0}, field_size=18)
    entity(draw, boxes["category"], "category", ["id", "name"], "orange", types=["TINYINT U", "VARCHAR(50) · UQ"], pk_rows={0}, field_size=18)
    entity(draw, boxes["exercise_muscle"], "exercise_muscle", ["#exercise_id", "#muscle_group_id", "role"], "orange", types=["INT U", "SMALLINT U", "ENUM(primary, secondary)"], pk_rows={0, 1}, field_size=18)
    entity(draw, boxes["muscle"], "muscle_group", ["id", "name"], "orange", types=["SMALLINT U", "VARCHAR(50) · UQ"], pk_rows={0}, title_size=25, field_size=17)
    entity(draw, boxes["exercise_equipment"], "exercise_equipment", ["#exercise_id", "#equipment_id"], "orange", types=["INT U", "SMALLINT U"], pk_rows={0, 1}, field_size=18)
    entity(draw, boxes["equipment"], "equipment", ["id", "name"], "orange", types=["SMALLINT U", "VARCHAR(50) · UQ"], pk_rows={0}, title_size=25, field_size=17)

    image.save(OUTPUT_DIR / "MPD_Impulsion_final.png", quality=95)


if __name__ == "__main__":
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    make_mcd()
    make_mld()
    make_mpd()
    print("Diagrammes générés dans", OUTPUT_DIR)
